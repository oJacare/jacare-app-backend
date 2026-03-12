import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';
import { MissionGateway } from '../../gateway/mission.gateway';
import {
  PublishMissionInputDto,
  PublishMissionOutputDto,
  PublishMissionUseCaseInterface,
} from './publish-mission.usecase.dto';
import { EntityValidationError } from '@/modules/@shared/domain/errors/unprocessable-entity.error';

export class PublishMissionUseCase implements PublishMissionUseCaseInterface {
  constructor(private readonly missionRepository: MissionGateway) {}

  async execute(
    input: PublishMissionInputDto,
  ): Promise<PublishMissionOutputDto> {
    const mission = await this.missionRepository.findByIdOrFail(
      input.missionId,
      input.organizationId,
    );

    const version = await this.missionRepository.findVersionByHash(
      input.missionId,
      input.versionHash,
    );

    if (!version) {
      throw new NotFoundError(
        `Versão '${input.versionHash}' não encontrada para a missão '${input.missionId}'.`,
      );
    }

    if (!version.isValid) {
      throw new EntityValidationError([
        {
          versionHash: [
            'Não é possível publicar uma versão com erros de validação. Corrija o grafo e salve novamente.',
          ],
        },
      ]);
    }

    mission.publish(input.versionHash);
    await this.missionRepository.update(mission);
    mission.emitPublishedEvent();

    return {
      id: mission.id,
      name: mission.name,
      status: mission.status,
      activeHash: mission.activeHash!,
      updatedAt: mission.updatedAt,
    };
  }
}
