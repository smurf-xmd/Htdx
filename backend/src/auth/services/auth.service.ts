import UserRepository from '../../users/repositories/user.repository';
import HashUtil from '../../utilities/hash.util';
import JwtUtil, { TokenPayload } from '../../utilities/jwt.util';
import EmailUtil from '../../utilities/email.util';
import ValidatorsUtil from '../../utilities/validators.util';
import LoggerUtil from '../../utilities/logger.util';
import { AppError, ErrorCodes, HTTP_STATUS } from '../../utilities/errors.util';
import { PrismaClient } from '@prisma/client';
import { RegisterRequest, LoginRequest, AuthResponse } from '../types/auth.types';

const prisma = new PrismaClient();

export class AuthService {
  private userRepository = new UserRepository();

  async register(data: RegisterRequest): Promise<AuthResponse> {
    if (!ValidatorsUtil.isValidEmail(data.email)) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Invalid email format', ErrorCodes.VALIDATION_ERROR);
    }

    if (!ValidatorsUtil.isValidUsername(data.username)) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        'Username must be 3-20 characters, alphanumeric and underscore only',
        ErrorCodes.VALIDATION_ERROR
      );
    }

    const passwordErrors = ValidatorsUtil.isStrongPassword(data.password);
    if (passwordErrors.length > 0) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, passwordErrors.join('. '), ErrorCodes.WEAK_PASSWORD);
    }

    if (data.password !== data.confirmPassword) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Passwords do not match', ErrorCodes.VALIDATION_ERROR);
    }

    const existingEmail = await this.userRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new AppError(HTTP_STATUS.CONFLICT, 'Email already registered', ErrorCodes.USER_ALREADY_EXISTS);
    }

    const existingUsername = await this.userRepository.findByUsername(data.username);
    if (existingUsername) {
      throw new AppError(HTTP_STATUS.CONFLICT, 'Username already taken', ErrorCodes.USER_ALREADY_EXISTS);
    }

    const passwordHash = await HashUtil.hashPassword(data.password);

    const user = await this.userRepository.create({
      email: data.email,
      username: data.username,
      passwordHash,
      fullName: data.fullName,
    });

    LoggerUtil.info('User registered', { userId: user.id, email: user.email });

    const verificationToken = HashUtil.generateRandomToken();
    await prisma.emailVerification.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    try {
      await EmailUtil.sendVerificationEmail(user.email, verificationToken);
    } catch (error) {
      LoggerUtil.warn('Failed to send verification email', { userId: user.id });
    }

    return this.generateAuthResponse(user);
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    if (!ValidatorsUtil.isValidEmail(data.email)) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Invalid email format', ErrorCodes.VALIDATION_ERROR);
    }

    if (!data.password) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Password is required', ErrorCodes.VALIDATION_ERROR);
    }

    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError(HTTP_STATUS.UNAUTHORIZED, 'Invalid credentials', ErrorCodes.INVALID_CREDENTIALS);
    }

    if (user.isSuspended) {
      throw new AppError(HTTP_STATUS.FORBIDDEN, 'Your account has been suspended', ErrorCodes.ACCOUNT_SUSPENDED);
    }

    const isPasswordValid = await HashUtil.comparePassword(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError(HTTP_STATUS.UNAUTHORIZED, 'Invalid credentials', ErrorCodes.INVALID_CREDENTIALS);
    }

    await this.userRepository.recordLoginTime(user.id);
    LoggerUtil.info('User logged in', { userId: user.id, email: user.email });

    return this.generateAuthResponse(user);
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    const payload = JwtUtil.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new AppError(HTTP_STATUS.UNAUTHORIZED, 'Invalid refresh token', ErrorCodes.INVALID_TOKEN);
    }

    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, 'User not found', ErrorCodes.USER_NOT_FOUND);
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new AppError(HTTP_STATUS.UNAUTHORIZED, 'Refresh token expired', ErrorCodes.TOKEN_EXPIRED);
    }

    const accessToken = JwtUtil.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const verification = await prisma.emailVerification.findUnique({
      where: { token },
    });

    if (!verification) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Invalid verification token', ErrorCodes.INVALID_TOKEN);
    }

    if (verification.expiresAt < new Date()) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Verification token expired', ErrorCodes.TOKEN_EXPIRED);
    }

    const user = await this.userRepository.verifyEmail(verification.userId);
    await prisma.emailVerification.delete({
      where: { id: verification.id },
    });

    LoggerUtil.info('Email verified', { userId: user.id, email: user.email });
    return { message: 'Email verified successfully' };
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return { message: 'If email exists, password reset link has been sent' };
    }

    const resetToken = HashUtil.generateRandomToken();
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    try {
      await EmailUtil.sendPasswordResetEmail(user.email, resetToken);
    } catch (error) {
      LoggerUtil.warn('Failed to send password reset email', { userId: user.id });
    }

    LoggerUtil.info('Password reset requested', { userId: user.id });
    return { message: 'If email exists, password reset link has been sent' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const passwordErrors = ValidatorsUtil.isStrongPassword(newPassword);
    if (passwordErrors.length > 0) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, passwordErrors.join('. '), ErrorCodes.WEAK_PASSWORD);
    }

    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token },
    });

    if (!resetRecord) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Invalid reset token', ErrorCodes.INVALID_TOKEN);
    }

    if (resetRecord.expiresAt < new Date()) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Reset token expired', ErrorCodes.TOKEN_EXPIRED);
    }

    if (resetRecord.usedAt) {
      throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Reset token already used', ErrorCodes.INVALID_TOKEN);
    }

    const passwordHash = await HashUtil.hashPassword(newPassword);
    await this.userRepository.updatePassword(resetRecord.userId, passwordHash);
    await prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { usedAt: new Date() },
    });

    LoggerUtil.info('Password reset', { userId: resetRecord.userId });
    return { message: 'Password reset successfully' };
  }

  private async generateAuthResponse(user: any): Promise<AuthResponse> {
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = JwtUtil.generateAccessToken(tokenPayload);
    const refreshToken = JwtUtil.generateRefreshToken(tokenPayload);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }
}

export default AuthService;