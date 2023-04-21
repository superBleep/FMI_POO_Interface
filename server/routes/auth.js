import { Router } from 'express';
import * as authController from '../controllers/auth.js';

const router = Router();

// TODO - Use validations before controller functions

// ! Temp - old /api/email-login
router.post('/login-email', authController.loginEmail);

// TODO - Create authController.login function
router.post('/login', authController.login);

// TODO - Create authController.register function
router.post('/register', authController.register);

export default router;
