import { Request, Response, NextFunction } from 'express';
import JwtUtil from '../../utilities/jwt.util';
import LoggerUtil from '../../utilities/logger.util';
import { AppError, ErrorCodes, HTTP_STATUS } from '../../utilities/errors.util';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      email?: string;
      role?: string;
    }
  }
}

export const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(HTTP_STATUS.UNAUTHORIZED, 'No token provided', ErrorCodes.UNAUTHORIZED);
    }

    const token = authHeader.substring(7);
    const payload = JwtUtil.verifyAccessToken(token);

    if (!payload) {
      throw new AppError(HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired token', ErrorCodes.INVALID_TOKEN);
    }

    req.userId = payload.userId;
    req.email = payload.email;
    req.role = payload.role;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.message,
        code: error.code,
      });
    }

    LoggerUtil.error('JWT middleware error', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: 'Internal server error',
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

export default jwtMiddleware;