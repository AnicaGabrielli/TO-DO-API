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