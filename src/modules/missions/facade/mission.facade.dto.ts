import {
  CreateMissionInputDto,
  CreateMissionOutputDto,
} from '../usecase/create-mission/create-mission.usecase.dto';
import {
  SaveMissionVersionInputDto,
  SaveMissionVersionOutputDto,
} from '../usecase/save-version/save-mission-version.usecase.dto';
import {
  PublishMissionInputDto,
  PublishMissionOutputDto,
} from '../usecase/publish-mission/publish-mission.usecase.dto';
import {
  ListMissionVersionsInputDto,
  MissionVersionItemDto,
} from '../usecase/list-versions/list-mission-versions.usecase.dto';
import { GetActiveMissionInputDto } from '../usecase/get-active/get-active-mission.usecase.dto';

export interface MissionFacadeInterface {
  createMission(input: CreateMissionInputDto): Promise<CreateMissionOutputDto>;
  saveVersion(
    input: SaveMissionVersionInputDto,
  ): Promise<SaveMissionVersionOutputDto>;
  publishMission(
    input: PublishMissionInputDto,
  ): Promise<PublishMissionOutputDto>;
  listVersions(
    input: ListMissionVersionsInputDto,
  ): Promise<MissionVersionItemDto[]>;
  getActive(input: GetActiveMissionInputDto): Promise<object>;
}
