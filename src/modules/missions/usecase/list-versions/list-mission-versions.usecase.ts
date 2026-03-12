import { MissionGateway } from '../../gateway/mission.gateway';
import {
  ListMissionVersionsInputDto,
  ListMissionVersionsUseCaseInterface,
  MissionVersionItemDto,
} from './list-mission-versions.usecase.dto';

export class ListMissionVersionsUseCase implements ListMissionVersionsUseCaseInterface {
  constructor(private readonly missionRepository: MissionGateway) {}

  async execute(
    input: ListMissionVersionsInputDto,
  ): Promise<MissionVersionItemDto[]> {
    await this.missionRepository.findByIdOrFail(
      input.missionId,
      input.organizationId,
    );

    const versions = await this.missionRepository.findVersionsByMissionId(
      input.missionId,
    );

    return versions.map((v) => ({
      id: v.id,
      missionId: v.missionId,
      hash: v.hash,
      isValid: v.isValid,
      validationErrors: v.validationErrors,
      authorId: v.authorId,
      createdAt: v.createdAt,
    }));
  }
}
