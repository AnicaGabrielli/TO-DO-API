import express from 'express';
import { register, login } from '../controllers/authController.js';
import { validateUserRegistration, validateUserLogin } from '../middleware/validation.js';

const router = express.Router();


router.post('/register', validateUserRegistration, register);