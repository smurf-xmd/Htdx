import { Request, Response, NextFunction } from 'express';
import { AppError, HTTP_STATUS, ErrorCodes } from '../utilities/errors.util';
import LoggerUtil from '../utilities/logger.util';

export const errorMiddleware = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    LoggerUtil.warn('App error', { statusCode: error.statusCode, message: error.message });
    return res.status(error.statusCode).json({
      error: error.message,
      code: error.code || ErrorCodes.INTERNAL_SERVER_ERROR,
    });
  }

  LoggerUtil.error('Unhandled error', { message: error.message });

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    error: 'Internal server error',
    code: ErrorCodes.INTERNAL_SERVER_ERROR,
  });
};

export default errorMiddleware;