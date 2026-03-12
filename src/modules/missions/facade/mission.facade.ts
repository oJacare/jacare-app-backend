import {
  CreateMissionUseCaseInterface,
  CreateMissionInputDto,
  CreateMissionOutputDto,
} from '../usecase/create-mission/create-mission.usecase.dto';
import {
  SaveMissionVersionUseCaseInterface,
  SaveMissionVersionInputDto,
  SaveMissionVersionOutputDto,
} from '../usecase/save-version/save-mission-version.usecase.dto';
import {
  PublishMissionUseCaseInterface,
  PublishMissionInputDto,
  PublishMissionOutputDto,
} from '../usecase/publish-mission/publish-mission.usecase.dto';
import {
  ListMissionVersionsUseCaseInterface,
  ListMissionVersionsInputDto,
  MissionVersionItemDto,
} from '../usecase/list-versions/list-mission-versions.usecase.dto';
import {
  GetActiveMissionUseCaseInterface,
  GetActiveMissionInputDto,
} from '../usecase/get-active/get-active-mission.usecase.dto';
import { MissionFacadeInterface } from './mission.facade.dto';

export class MissionFacade implements MissionFacadeInterface {
  constructor(
    private readonly createMissionUseCase: CreateMissionUseCaseInterface,
    private readonly saveVersionUseCase: SaveMissionVersionUseCaseInterface,
    private readonly publishMissionUseCase: PublishMissionUseCaseInterface,
    private readonly listVersionsUseCase: ListMissionVersionsUseCaseInterface,
    private readonly getActiveUseCase: GetActiveMissionUseCaseInterface,
  ) {}

  async createMission(
    input: CreateMissionInputDto,
  ): Promise<CreateMissionOutputDto> {
    return this.createMissionUseCase.execute(input);
  }

  async saveVersion(
    input: SaveMissionVersionInputDto,
  ): Promise<SaveMissionVersionOutputDto> {
    return this.saveVersionUseCase.execute(input);
  }

  async publishMission(
    input: PublishMissionInputDto,
  ): Promise<PublishMissionOutputDto> {
    return this.publishMissionUseCase.execute(input);
  }

  async listVersions(
    input: ListMissionVersionsInputDto,
  ): Promise<MissionVersionItemDto[]> {
    return this.listVersionsUseCase.execute(input);
  }

  async getActive(input: GetActiveMissionInputDto): Promise<object> {
    return this.getActiveUseCase.execute(input);
  }
}
