import prisma from '@/infra/database/prisma.instance';
import { MissionRepository } from '../repository/mission.repository';
import { CreateMissionUseCase } from '../usecase/create-mission/create-mission.usecase';
import { SaveMissionVersionUseCase } from '../usecase/save-version/save-mission-version.usecase';
import { PublishMissionUseCase } from '../usecase/publish-mission/publish-mission.usecase';
import { ListMissionVersionsUseCase } from '../usecase/list-versions/list-mission-versions.usecase';
import { GetActiveMissionUseCase } from '../usecase/get-active/get-active-mission.usecase';
import { MissionFacade } from '../facade/mission.facade';

export class MissionFacadeFactory {
  static create(): MissionFacade {
    const repository = new MissionRepository(prisma);

    const createMissionUseCase = new CreateMissionUseCase(repository);
    const saveVersionUseCase = new SaveMissionVersionUseCase(repository);
    const publishMissionUseCase = new PublishMissionUseCase(repository);
    const listVersionsUseCase = new ListMissionVersionsUseCase(repository);
    const getActiveUseCase = new GetActiveMissionUseCase(repository);

    return new MissionFacade(
      createMissionUseCase,
      saveVersionUseCase,
      publishMissionUseCase,
      listVersionsUseCase,
      getActiveUseCase,
    );
  }
}
