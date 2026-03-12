import { randomBytes, createHash } from 'crypto';
import { ApiKeyGateway } from '../../gateway/api-key.gateway';
import { ApiKey } from '../../domain/api-key.entity';
import {
  CreateInputDto,
  CreateOutputDto,
  CreateUseCaseInterface,
} from './create.usecase.dto';

export class CreateUseCase implements CreateUseCaseInterface {
  constructor(private readonly apiKeyRepository: ApiKeyGateway) {}

  async execute(input: CreateInputDto): Promise<CreateOutputDto> {
    const rawKey = this.generateRawKey();
    const keyHash = this.hashKey(rawKey);
    const prefix = rawKey.substring(0, 12);

    const apiKey = ApiKey.create({
      organizationId: input.organizationId,
      name: input.name,
      keyHash,
      prefix,
      expiresAt: input.expiresAt ?? null,
    });

    await this.apiKeyRepository.create(apiKey);

    return {
      id: apiKey.id,
      name: apiKey.name,
      prefix: apiKey.prefix,
      rawKey,
      createdAt: apiKey.createdAt,
    };
  }

  private generateRawKey(): string {
    return `jcr_live_${randomBytes(32).toString('hex')}`;
  }

  private hashKey(rawKey: string): string {
    return createHash('sha256').update(rawKey).digest('hex');
  }
}
