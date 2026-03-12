import { createHash } from 'crypto';
import {
  MissionGateway,
  MissionVersionPersistData,
} from '../../gateway/mission.gateway';
import {
  SaveMissionVersionInputDto,
  SaveMissionVersionOutputDto,
  SaveMissionVersionUseCaseInterface,
} from './save-mission-version.usecase.dto';

export class SaveMissionVersionUseCase implements SaveMissionVersionUseCaseInterface {
  constructor(private readonly missionRepository: MissionGateway) {}

  async execute(
    input: SaveMissionVersionInputDto,
  ): Promise<SaveMissionVersionOutputDto> {
    await this.missionRepository.findByIdOrFail(
      input.missionId,
      input.organizationId,
    );

    /**
     * SHA-256 gerado a partir do JSON compilado (missionData).
     * Este hash é a identidade da versão: se o conteúdo não mudou, o hash é igual.
     * Usado pelo Jacare Runtime para invalidar cache sem re-download.
     */
    const sha256Hash = createHash('sha256')
      .update(JSON.stringify(input.missionData))
      .digest('hex');

    const versionPersistData: MissionVersionPersistData = {
      missionId: input.missionId,
      hash: sha256Hash,
      graphData: input.graphData,
      missionData: input.missionData,
      isValid: input.isValid,
      validationErrors: input.validationErrors ?? null,
      authorId: input.authorId,
    };

    const savedVersion =
      await this.missionRepository.saveVersion(versionPersistData);

    return {
      id: savedVersion.id,
      missionId: savedVersion.missionId,
      hash: savedVersion.hash,
      isValid: savedVersion.isValid,
      validationErrors: savedVersion.validationErrors,
      createdAt: savedVersion.createdAt,
    };
  }
}
