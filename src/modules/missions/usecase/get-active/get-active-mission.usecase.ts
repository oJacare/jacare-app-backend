import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';
import { MissionGateway } from '../../gateway/mission.gateway';
import {
  GetActiveMissionInputDto,
  GetActiveMissionUseCaseInterface,
} from './get-active-mission.usecase.dto';

export class GetActiveMissionUseCase implements GetActiveMissionUseCaseInterface {
  constructor(private readonly missionRepository: MissionGateway) {}

  async execute(input: GetActiveMissionInputDto): Promise<object> {
    const mission = await this.missionRepository.findByIdOrFail(
      input.missionId,
      input.organizationId,
    );

    if (!mission.activeHash) {
      throw new NotFoundError(
        `A missão '${input.missionId}' existe, mas não tem versão publicada.`,
      );
    }

    const version = await this.missionRepository.findVersionByHash(
      input.missionId,
      mission.activeHash,
    );

    if (!version) {
      throw new Error(
        `Estado corrompido: activeHash '${mission.activeHash}' não aponta para nenhuma versão existente.`,
      );
    }

    return version.missionData;
  }
}
