# Todo API - Sistema de Gerenciamento de Tarefas

Uma API REST simples e funcional para gerenciar tarefas pessoais, desenvolvida com Node.js, Express e SQLite.

## 🚀 Tecnologia Escolhida

**Node.js com Express** - Escolhi essa stack por ser:
- **Simples e direta**: Código limpo e fácil de entender
- **Rápida para desenvolver**: Menos configuração, mais funcionalidade
- **Amplamente conhecida**: Facilita manutenção e colaboração
- **Performática**: Ideal para APIs REST
- **Ecossistema rico**: Muitas bibliotecas disponíveis

## 📦 Pré-requisitos

- Node.js versão 18 ou superior
- npm (geralmente vem com o Node.js)

## 🛠️ Setup do Projeto

### 1. Clone o repositório
```bash
git clone <url-do-seu-repositorio>
cd todo-api
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas configurações
# Você pode usar os valores padrão que já estão no .env.example
```

### 4. Configure o banco de dados
```bash
npm run setup
```

### 5. Inicie o servidor
```bash
# Modo desenvolvimento (reinicia automaticamente)
npm run dev

# Ou modo produção
npm start
```

## 🌐 Como Executar

Após seguir os passos de setup:

1. **Inicie o servidor**:
   ```bash
   npm run dev
   ```

2. **Acesse a API**:
   - Servidor: `http://localhost:3000`
   - Documentação: `http://localhost:3000/api-docs`

3. **Teste os endpoints**:
   - Use o Postman/Insomnia com a collection fornecida
   - Ou use a documentação Swagger interativa

## 📝 Como Testar

### Opção 1: Swagger/OpenAPI (Recomendado)
1. Acesse `http://localhost:3000/api-docs`
2. Use a interface interativa para testar todos os endpoints
3. Copie o token JWT do login para usar nos endpoints protegidos

### Opção 2: Postman/Insomnia
1. Importe o arquivo `postman_collection.json`
2. A collection já está configurada com exemplos
3. Execute primeiro o login para obter o token
4. O token será automaticamente salvo para usar nos outros endpoints

### Opção 3: cURL
```bash
# Registrar usuário
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva","email":"joao@email.com","password":"123456"}'

# Fazer login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","password":"123456"}'

# Criar tarefa (substitua SEU_TOKEN pelo token recebido no login)
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"title":"Estudar Node.js","description":"Revisar conceitos de API REST"}'

# Listar tarefas
curl -X GET http://localhost:3000/tasks \
  -H "Authorization: Bearer SEU_TOKEN"
```

## 🏗️ Estrutura do Projeto

```
src/
├── controllers/         # Lógica de negócio
│   ├── authController.js
│   └── tasksController.js
├── middleware/          # Middlewares customizados
│   ├── auth.js         # Autenticação JWT
│   └── validation.js   # Validação de dados
├── routes/             # Definição de rotas
│   ├── auth.js
│   └── tasks.js
├── config/             # Configurações
│   └── swagger.js      # Documentação API
├── database.js         # Configuração do banco
├── server.js          # Servidor principal
└── setup.js           # Script de configuração
```

## 🔧 Decisões Técnicas

### **Banco de Dados: SQLite**
- **Por quê?** Simples, sem configuração externa, ideal para desenvolvimento
- **Benefícios**: Zero configuração, portável, suficiente para o escopo do projeto

### **Autenticação: JWT**
- **Por quê?** Stateless, simples de implementar, padrão da indústria
- **Implementação**: Middleware customizado para validação de tokens

### **Validação: express-validator**
- **Por quê?** Biblioteca madura, integração fácil com Express
- **Benefícios**: Validações robustas e mensagens de erro claras

### **Documentação: Swagger/OpenAPI**
- **Por quê?** Padrão da indústria, interface interativa, auto-documentação
- **Benefícios**: Facilita testes e entendimento da API

### **Estrutura de Pastas**
- **Controllers**: Lógica de negócio separada das rotas
- **Middleware**: Reutilização de código para autenticação e validação
- **Separação de responsabilidades**: Cada arquivo tem uma função específica

## 🛡️ Segurança Implementada

- ✅ **Senhas criptografadas** com bcrypt
- ✅ **Autenticação JWT** com expiração
- ✅ **Validação de dados** robusta
- ✅ **Middleware de autenticação** para rotas protegidas
- ✅ **Tratamento de erros** adequado
- ✅ **CORS configurado** para desenvolvimento

## 📊 Endpoints da API

### **Autenticação**
- `POST /auth/register` - Cadastro de usuário
- `POST /auth/login` - Login

### **Tarefas** (Requer autenticação)
- `GET /tasks` - Listar tarefas
- `GET /tasks?status=completed` - Filtrar por status
- `POST /tasks` - Criar tarefa
- `GET /tasks/:id` - Buscar tarefa por ID
- `PUT /tasks/:id` - Atualizar tarefa
- `DELETE /tasks/:id` - Excluir tarefa

## 🚀 Melhorias Futuras

Se tivesse mais tempo, implementaria:

1. **Testes Automatizados**
   - Testes unitários com Jest
   - Testes de integração para endpoints

2. **Logs Estruturados**
   - Winston para logging
   - Logs de auditoria para ações críticas

3. **Soft Delete**
   - Exclusão lógica de tarefas
   - Possibilidade de recuperar tarefas excluídas

4. **Paginação**
   - Paginação nas listagens
   - Melhor performance com muitos dados

5. **Rate Limiting**
   - Proteção contra abuso da API
   - Limites por usuário/IP

6. **Webhooks**
   - Notificações para tarefas vencidas
   - Integração com outros sistemas

7. **Upload de Arquivos**
   - Anexos em tarefas
   - Armazenamento de imagens

8. **Categorias/Tags**
   - Organização melhor das tarefas
   - Filtros mais avançados

## 🐛 Troubleshooting

### Erro: "Cannot find module"
```bash
# Reinstale as dependências
rm -rf node_modules package-lock.json
npm install
```

### Erro: "EADDRINUSE"
```bash
# Porta já está em uso, mude no .env
PORT=3001
```

### Erro: "Database locked"
```bash
# Remova o banco e recrie
rm database.sqlite
npm run setup
```

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do servidor
2. Consulte a documentação Swagger
3. Verifique se todas as dependências foram instaladas
4. Confirme se o banco foi configurado corretamente

## 📝 Exemplo de Uso Completo

```javascript
// 1. Registrar usuário
const registerResponse = await fetch('http://localhost:3000/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'João Silva',
    email: 'joao@email.com',
    password: '123456'
  })
});

// 2. Fazer login
const loginResponse = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'joao@email.com',
    password: '123456'
  })
});

const { token } = await loginResponse.json();

// 3. Criar tarefa
const taskResponse = await fetch('http://localhost:3000/tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Estudar Node.js',
    description: 'Revisar conceitos de API REST',
    dueDate: '2024-06-10T10:00:00Z'
  })
});
```

---

**Desenvolvido com ❤️ para o teste técnico da Reis Softwares**