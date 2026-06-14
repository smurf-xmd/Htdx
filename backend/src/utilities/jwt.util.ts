import jwt from 'jsonwebtoken';
import { environment } from '../config/environment';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export class JwtUtil {
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, environment.JWT_ACCESS_SECRET, {
      expiresIn: environment.JWT_ACCESS_EXPIRY,
    });
  }

  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, environment.JWT_REFRESH_SECRET, {
      expiresIn: environment.JWT_REFRESH_EXPIRY,
    });
  }

  static verifyAccessToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, environment.JWT_ACCESS_SECRET) as TokenPayload;
    } catch {
      return null;
    }
  }

  static verifyRefreshToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, environment.JWT_REFRESH_SECRET) as TokenPayload;
    } catch {
      return null;
    }
  }

  static decodeToken(token: string): any {
    return jwt.decode(token);
  }
}

export default JwtUtil;