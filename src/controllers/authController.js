import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database.js';

// Registrar novo usuário
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar se o email já existe
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, existingUser) => {
      if (err) {
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }

      if (existingUser) {
        return res.status(400).json({ error: 'Email já está em uso' });
      }

      // Criptografar a senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Inserir novo usuário
      db.run(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Erro ao criar usuário' });
          }

          res.status(201).json({
            message: 'Usuário criado com sucesso',
            user: {
              id: this.lastID,
              name,
              email
            }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Fazer login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuário pelo email
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }

      // Verificar senha
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }

      // Gerar token JWT
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          name: user.name
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login realizado com sucesso',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};