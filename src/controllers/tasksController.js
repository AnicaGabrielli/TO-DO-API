import { db } from '../database.js';

// Listar tarefas do usuário logado
export const getTasks = (req, res) => {
  const userId = req.user.id;
  const { status } = req.query;

  let query = 'SELECT * FROM tasks WHERE userId = ?';
  let params = [userId];

  // Filtrar por status se fornecido
  if (status && (status === 'pending' || status === 'completed')) {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY createdAt DESC';

  db.all(query, params, (err, tasks) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar tarefas' });
    }

    res.json({
      tasks,
      total: tasks.length
    });
  });
};

// Buscar tarefa específica por ID
export const getTaskById = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  db.get(
    'SELECT * FROM tasks WHERE id = ? AND userId = ?', 
    [id, userId], 
    (err, task) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar tarefa' });
      }

      if (!task) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }

      res.json(task);
    }
  );
};

// Criar nova tarefa
export const createTask = (req, res) => {
  const { title, description, dueDate } = req.body;
  const userId = req.user.id;

  db.run(
    `INSERT INTO tasks (title, description, dueDate, userId) 
     VALUES (?, ?, ?, ?)`,
    [title, description || null, dueDate || null, userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao criar tarefa' });
      }

      // Buscar a tarefa criada para retornar os dados completos
      db.get(
        'SELECT * FROM tasks WHERE id = ?',
        [this.lastID],
        (err, task) => {
          if (err) {
            return res.status(500).json({ error: 'Erro ao recuperar tarefa criada' });
          }

          res.status(201).json({
            message: 'Tarefa criada com sucesso',
            task
          });
        }
      );
    }
  );
};

// Atualizar tarefa
export const updateTask = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { title, description, status, dueDate } = req.body;

  // Primeiro verificar se a tarefa existe e pertence ao usuário
  db.get(
    'SELECT * FROM tasks WHERE id = ? AND userId = ?',
    [id, userId],
    (err, existingTask) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar tarefa' });
      }

      if (!existingTask) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }

      // Construir query de update dinamicamente
      const updates = [];
      const params = [];

      if (title !== undefined) {
        updates.push('title = ?');
        params.push(title);
      }
      if (description !== undefined) {
        updates.push('description = ?');
        params.push(description);
      }
      if (status !== undefined) {
        updates.push('status = ?');
        params.push(status);
      }
      if (dueDate !== undefined) {
        updates.push('dueDate = ?');
        params.push(dueDate);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'Nenhum campo para atualizar fornecido' });
      }

      updates.push('updatedAt = CURRENT_TIMESTAMP');
      params.push(id, userId);

      const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ? AND userId = ?`;

      db.run(query, params, function(err) {
        if (err) {
          return res.status(500).json({ error: 'Erro ao atualizar tarefa' });
        }

        // Buscar a tarefa atualizada
        db.get(
          'SELECT * FROM tasks WHERE id = ? AND userId = ?',
          [id, userId],
          (err, updatedTask) => {
            if (err) {
              return res.status(500).json({ error: 'Erro ao recuperar tarefa atualizada' });
            }

            res.json({
              message: 'Tarefa atualizada com sucesso',
              task: updatedTask
            });
          }
        );
      });
    }
  );
};

// Excluir tarefa
export const deleteTask = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Primeiro verificar se a tarefa existe e pertence ao usuário
  db.get(
    'SELECT * FROM tasks WHERE id = ? AND userId = ?',
    [id, userId],
    (err, task) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar tarefa' });
      }

      if (!task) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }

      // Excluir a tarefa
      db.run(
        'DELETE FROM tasks WHERE id = ? AND userId = ?',
        [id, userId],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Erro ao excluir tarefa' });
          }

          res.json({
            message: 'Tarefa excluída com sucesso',
            deletedTask: task
          });
        }
      );
    }
  );
};