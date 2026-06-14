import bcrypt from 'bcrypt';
import { environment } from '../config/environment';

export class HashUtil {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, environment.BCRYPT_ROUNDS);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateRandomToken(): string {
    return require('crypto').randomBytes(32).toString('hex');
  }
}

export default HashUtil;