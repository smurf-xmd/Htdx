import { Request, Response } from 'express';
import AuthService from '../services/auth.service';
import { AppError, ErrorCodes, HTTP_STATUS } from '../../utilities/errors.util';
import LoggerUtil from '../../utilities/logger.util';

export class AuthController {
  private authService = new AuthService();

  async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.authService.register(req.body);
      res.status(HTTP_STATUS.CREATED).json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.authService.login(req.body);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Refresh token required', ErrorCodes.VALIDATION_ERROR);
      }
      const result = await this.authService.refreshAccessToken(refreshToken);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;
      if (!token) {
        throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Verification token required', ErrorCodes.VALIDATION_ERROR);
      }
      const result = await this.authService.verifyEmail(token);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Email required', ErrorCodes.VALIDATION_ERROR);
      }
      const result = await this.authService.requestPasswordReset(email);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, password, confirmPassword } = req.body;
      if (!token || !password || !confirmPassword) {
        throw new AppError(HTTP_STATUS.BAD_REQUEST, 'All fields required', ErrorCodes.VALIDATION_ERROR);
      }
      if (password !== confirmPassword) {
        throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Passwords do not match', ErrorCodes.VALIDATION_ERROR);
      }
      const result = await this.authService.resetPassword(token, password);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      res.status(HTTP_STATUS.OK).json({ message: 'Logged out successfully' });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private handleError(error: any, res: Response): void {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.message,
        code: error.code,
      });
    }
    LoggerUtil.error('Auth controller error', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: 'Internal server error',
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export default AuthController;