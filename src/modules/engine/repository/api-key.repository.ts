import type {
  OrganizationApiKey as PrismaApiKeyRow,
  PrismaClient,
} from '@prisma/client';
import { ApiKey, ApiKeyProps } from '../domain/api-key.entity';
import { ApiKeyGateway } from '../gateway/api-key.gateway';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';

export class ApiKeyRepository implements ApiKeyGateway {
  constructor(private readonly prisma: PrismaClient) {}

  private toDomainEntity(prismaRow: PrismaApiKeyRow): ApiKey {
    return new ApiKey({
      id: prismaRow.id,
      organizationId: prismaRow.organizationId,
      name: prismaRow.name,
      keyHash: prismaRow.keyHash,
      prefix: prismaRow.prefix,
      lastUsedAt: prismaRow.lastUsedAt,
      expiresAt: prismaRow.expiresAt,
      revokedAt: prismaRow.revokedAt,
      createdAt: prismaRow.createdAt,
    } satisfies ApiKeyProps);
  }

  async findByHash(keyHash: string): Promise<ApiKey | null> {
    const prismaRow = await this.prisma.organizationApiKey.findFirst({
      where: {
        keyHash,
        revokedAt: null,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
    });

    if (!prismaRow) return null;
    return this.toDomainEntity(prismaRow);
  }

  async findById(id: string, organizationId: string): Promise<ApiKey | null> {
    const prismaRow = await this.prisma.organizationApiKey.findFirst({
      where: { id, organizationId },
    });

    if (!prismaRow) return null;
    return this.toDomainEntity(prismaRow);
  }

  async findByIdOrFail(id: string, organizationId: string): Promise<ApiKey> {
    const apiKey = await this.findById(id, organizationId);

    if (!apiKey) {
      throw new NotFoundError(
        `API Key '${id}' não encontrada na organização '${organizationId}'.`,
      );
    }

    return apiKey;
  }

  async findByOrganization(organizationId: string): Promise<ApiKey[]> {
    const prismaRows = await this.prisma.organizationApiKey.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });

    return prismaRows.map((row) => this.toDomainEntity(row));
  }

  async create(apiKey: ApiKey): Promise<void> {
    await this.prisma.organizationApiKey.create({
      data: {
        id: apiKey.id,
        organizationId: apiKey.organizationId,
        name: apiKey.name,
        keyHash: apiKey.keyHash,
        prefix: apiKey.prefix,
        expiresAt: apiKey.expiresAt,
        createdAt: apiKey.createdAt,
      },
    });
  }

  async update(apiKey: ApiKey): Promise<void> {
    await this.prisma.organizationApiKey.update({
      where: { id: apiKey.id },
      data: {
        revokedAt: apiKey.revokedAt,
        lastUsedAt: apiKey.lastUsedAt,
      },
    });
  }
}
