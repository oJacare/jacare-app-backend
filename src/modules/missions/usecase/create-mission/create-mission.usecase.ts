import { MissionGateway } from '../../gateway/mission.gateway';
import { Mission } from '../../domain/mission.entity';
import {
  CreateMissionInputDto,
  CreateMissionOutputDto,
  CreateMissionUseCaseInterface,
} from './create-mission.usecase.dto';
import { EntityValidationError } from '@/modules/@shared/domain/errors/unprocessable-entity.error';

export class CreateMissionUseCase implements CreateMissionUseCaseInterface {
  constructor(private readonly missionRepository: MissionGateway) {}

  async execute(input: CreateMissionInputDto): Promise<CreateMissionOutputDto> {
    const existing = await this.missionRepository.findById(
      input.id,
      input.organizationId,
    );

    if (existing) {
      throw new EntityValidationError([
        { id: [`Missão com id '${input.id}' já existe nesta organização.`] },
      ]);
    }

    const mission = Mission.create({
      id: input.id,
      name: input.name,
      description: input.description,
      organizationId: input.organizationId,
      authorId: input.authorId,
    });

    await this.missionRepository.create(mission);

    return mission.toJSON();
  }
}
