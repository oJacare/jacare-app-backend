import { ApiKeyGateway } from '../../gateway/api-key.gateway';
import {
  SearchInputDto,
  SearchItemDto,
  SearchUseCaseInterface,
} from './search.usecase.dto';

export class SearchUseCase implements SearchUseCaseInterface {
  constructor(private readonly apiKeyRepository: ApiKeyGateway) {}

  async execute(input: SearchInputDto): Promise<SearchItemDto[]> {
    const keys = await this.apiKeyRepository.findByOrganization(
      input.organizationId,
    );

    return keys.map((key) => ({
      id: key.id,
      name: key.name,
      prefix: key.prefix,
      lastUsedAt: key.lastUsedAt,
      expiresAt: key.expiresAt,
      revokedAt: key.revokedAt,
      createdAt: key.createdAt,
    }));
  }
}
