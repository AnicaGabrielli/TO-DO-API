import { body, validationResult } from 'express-validator';

// Middleware para checar erros de validação
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Dados inválidos',
      details: errors.array()
    });
  }
  next();
};

// Validações para registro de usuário
export const validateUserRegistration = [
  body('name')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 2 })
    .withMessage('Nome deve ter pelo menos 2 caracteres'),
  
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),

  handleValidationErrors
];

// Validações para login
export const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória'),

  handleValidationErrors
];

// Validações para criação de tarefa
export const validateTaskCreation = [
  body('title')
    .notEmpty()
    .withMessage('Título é obrigatório')
    .isLength({ min: 1, max: 255 })
    .withMessage('Título deve ter entre 1 e 255 caracteres'),
  
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Descrição deve ter no máximo 1000 caracteres'),
  
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Data de vencimento deve estar no formato ISO 8601'),

  handleValidationErrors
];

// Validações para atualização de tarefa
export const validateTaskUpdate = [
  body('title')
    .optional()
    .isLength({ min: 1, max: 255 })
    .withMessage('Título deve ter entre 1 e 255 caracteres'),
  
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Descrição deve ter no máximo 1000 caracteres'),
  
  body('status')
    .optional()
    .isIn(['pending', 'completed'])
    .withMessage('Status deve ser "pending" ou "completed"'),
  
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Data de vencimento deve estar no formato ISO 8601'),

  handleValidationErrors
];