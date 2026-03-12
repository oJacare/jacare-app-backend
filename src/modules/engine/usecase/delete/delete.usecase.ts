import { ApiKeyGateway } from '../../gateway/api-key.gateway';
import { EntityValidationError } from '@/modules/@shared/domain/errors/unprocessable-entity.error';
import { DeleteInputDto, DeleteUseCaseInterface } from './delete.usecase.dto';

export class DeleteUseCase implements DeleteUseCaseInterface {
  constructor(private readonly apiKeyRepository: ApiKeyGateway) {}

  async execute(input: DeleteInputDto): Promise<void> {
    const apiKey = await this.apiKeyRepository.findByIdOrFail(
      input.id,
      input.organizationId,
    );

    if (apiKey.revokedAt) {
      throw new EntityValidationError([
        { id: ['Esta API Key já foi revogada.'] },
      ]);
    }

    apiKey.revoke();
    await this.apiKeyRepository.update(apiKey);
  }
}
