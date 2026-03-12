import type { User as PrismaUserRow, PrismaClient } from '@prisma/client';
import { User, UserProps } from '../domain/user.entity';
import {
  AccountGateway,
  CreateOrganizationData,
  CreateMemberData,
  MemberRecord,
  MemberWithUser,
} from '../gateway/account.gateway';

export class AccountRepository implements AccountGateway {
  constructor(private readonly prisma: PrismaClient) {}

  private toDomainEntity(prismaRow: PrismaUserRow): User {
    return new User({
      id: prismaRow.id,
      email: prismaRow.email,
      name: prismaRow.name,
      password: prismaRow.password,
      avatarUrl: prismaRow.avatarUrl,
      createdAt: prismaRow.createdAt,
      updatedAt: prismaRow.updatedAt,
      deletedAt: prismaRow.deletedAt,
    } satisfies UserProps);
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaRow = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!prismaRow) return null;
    return this.toDomainEntity(prismaRow);
  }

  async createUser(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        password: user.password,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  }

  async createOrganization(data: CreateOrganizationData): Promise<string> {
    const org = await this.prisma.organization.create({
      data: {
        name: data.name,
        slug: data.slug,
      },
    });
    return org.id;
  }

  async createMember(data: CreateMemberData): Promise<MemberRecord> {
    const member = await this.prisma.member.create({
      data: {
        userId: data.userId,
        organizationId: data.organizationId,
        role: data.role,
      },
    });
    return {
      id: member.id,
      userId: member.userId,
      organizationId: member.organizationId,
      role: member.role,
    };
  }

  async findMemberWithUser(memberId: string): Promise<MemberWithUser | null> {
    const member = await this.prisma.member.findFirst({
      where: { id: memberId, deletedAt: null },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatarUrl: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!member) return null;

    return {
      memberId: member.id,
      userId: member.userId,
      organizationId: member.organizationId,
      role: member.role,
      user: member.user,
      organization: member.organization,
    };
  }

  async findFirstMemberByUserId(userId: string): Promise<MemberRecord | null> {
    const member = await this.prisma.member.findFirst({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });

    if (!member) return null;

    return {
      id: member.id,
      userId: member.userId,
      organizationId: member.organizationId,
      role: member.role,
    };
  }
}
