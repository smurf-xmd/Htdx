import fs from 'fs';
import path from 'path';
import { environment } from '../config/environment';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export class LoggerUtil {
  private static logDir = path.join(process.cwd(), 'logs');

  static {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private static getTimestamp(): string {
    return new Date().toISOString();
  }

  private static formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = this.getTimestamp();
    const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${dataStr}`;
  }

  private static writeToFile(message: string): void {
    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(this.logDir, `${today}.log`);
    fs.appendFileSync(logFile, message + '\n');
  }

  static info(message: string, data?: any): void {
    const formatted = this.formatMessage('info', message, data);
    console.log(formatted);
    this.writeToFile(formatted);
  }

  static warn(message: string, data?: any): void {
    const formatted = this.formatMessage('warn', message, data);
    console.warn(formatted);
    this.writeToFile(formatted);
  }

  static error(message: string, data?: any): void {
    const formatted = this.formatMessage('error', message, data);
    console.error(formatted);
    this.writeToFile(formatted);
  }

  static debug(message: string, data?: any): void {
    if (environment.LOG_LEVEL === 'debug') {
      const formatted = this.formatMessage('debug', message, data);
      console.log(formatted);
      this.writeToFile(formatted);
    }
  }
}

export default LoggerUtil;