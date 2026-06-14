import { PrismaClient, User, UserRole, SubscriptionPlan } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository {
  async create(data: {
    email: string;
    username: string;
    passwordHash: string;
    fullName?: string;
  }): Promise<User> {
    return prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        passwordHash: data.passwordHash,
        fullName: data.fullName || null,
        role: UserRole.USER,
        subscriptionPlan: SubscriptionPlan.FREE,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { username } });
  }

  async updateById(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  async verifyEmail(userId: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { isEmailVerified: true },
    });
  }

  async updatePassword(userId: string, passwordHash: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  async suspend(userId: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { isSuspended: true },
    });
  }

  async unsuspend(userId: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { isSuspended: false },
    });
  }

  async updateSubscriptionPlan(userId: string, plan: SubscriptionPlan): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { subscriptionPlan: plan },
    });
  }

  async recordLoginTime(userId: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }
}

export default UserRepository;