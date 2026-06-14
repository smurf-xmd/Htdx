import express, { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import jwtMiddleware from '../middleware/jwt.middleware';

const router: Router = express.Router();
const authController = new AuthController();

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/refresh', (req, res) => authController.refreshToken(req, res));
router.post('/verify-email', (req, res) => authController.verifyEmail(req, res));
router.post('/forgot-password', (req, res) => authController.forgotPassword(req, res));
router.post('/reset-password', (req, res) => authController.resetPassword(req, res));
router.post('/logout', jwtMiddleware, (req, res) => authController.logout(req, res));

export default router;