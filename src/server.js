import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { initDatabase } from './database.js';
import authRoutes from './routes/auth.js';
import tasksRoutes from './routes/tasks.js';
import { specs, swaggerUi } from './config/swagger.js';

// Carregar variáveis de ambiente
config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Todo API Documentation"
}));

// Rotas
app.use('/auth', authRoutes);
app.use('/tasks', tasksRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Todo API funcionando!',
    documentation: `http://localhost:${PORT}/api-docs`,
    endpoints: {
      auth: {
        register: 'POST /auth/register',
        login: 'POST /auth/login'
      },
      tasks: {
        list: 'GET /tasks',
        create: 'POST /tasks',
        getById: 'GET /tasks/:id',
        update: 'PUT /tasks/:id',
        delete: 'DELETE /tasks/:id'
      }
    }
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    message: 'Verifique a documentação em /api-docs'
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: 'Algo deu errado!'
  });
});

// Inicializar banco de dados e servidor
const startServer = async () => {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Documentação disponível em: http://localhost:${PORT}/api-docs`);
      console.log(`API disponível em: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao inicializar servidor:', error);
    process.exit(1);
  }
};

startServer();