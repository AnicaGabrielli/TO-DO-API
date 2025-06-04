import { initDatabase } from './database.js';
import { config } from 'dotenv';

// Carregar variáveis de ambiente
config();

console.log('🔧 Configurando banco de dados...');

try {
  await initDatabase();
  console.log('Banco de dados configurado com sucesso!');
  console.log('Agora você pode rodar: npm start');
} catch (error) {
  console.error('Erro ao configurar banco de dados:', error);
  process.exit(1);
}
