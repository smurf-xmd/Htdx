import nodemailer from 'nodemailer';
import { environment } from '../config/environment';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class EmailUtil {
  private static transporter = nodemailer.createTransport({
    host: environment.SMTP_HOST,
    port: environment.SMTP_PORT,
    auth: {
      user: environment.SMTP_USER,
      pass: environment.SMTP_PASS,
    },
  });

  static async sendVerificationEmail(to: string, token: string): Promise<void> {
    const verificationLink = `${environment.FRONTEND_URL}/verify-email?token=${token}`;
    
    await this.transporter.sendMail({
      to,
      subject: 'Verify Your Email - HTD-X',
      html: `<h2>Welcome to HTD-X!</h2><p>Please verify your email:</p><a href="${verificationLink}" style="padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a><p>Link expires in 24 hours.</p>`,
    });
  }

  static async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const resetLink = `${environment.FRONTEND_URL}/reset-password?token=${token}`;
    
    await this.transporter.sendMail({
      to,
      subject: 'Reset Your Password - HTD-X',
      html: `<h2>Password Reset Request</h2><p>Click the link below to reset your password:</p><a href="${resetLink}" style="padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a><p>Link expires in 1 hour.</p>`,
    });
  }

  static async sendWelcomeEmail(to: string, username: string): Promise<void> {
    await this.transporter.sendMail({
      to,
      subject: 'Welcome to HTD-X',
      html: `<h2>Welcome, ${username}!</h2><p>Your account has been created successfully. You can now log in and start managing your WhatsApp bots.</p><a href="${environment.FRONTEND_URL}/login" style="padding: 10px 20px; background: #28a745; color: white; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>`,
    });
  }
}

export default EmailUtil;