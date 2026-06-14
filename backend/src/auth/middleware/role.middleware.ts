import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorCodes, HTTP_STATUS } from '../../utilities/errors.util';

export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.role || !allowedRoles.includes(req.role)) {
      const error = new AppError(HTTP_STATUS.FORBIDDEN, 'Insufficient permissions', ErrorCodes.FORBIDDEN);
      return res.status(error.statusCode).json({
        error: error.message,
        code: error.code,
      });
    }

    next();
  };
};

export default requireRole;