import { MissionFacade } from '@/modules/missions/facade/mission.facade';
import { CreateMissionInputDto } from '@/modules/missions/usecase/create-mission/create-mission.usecase.dto';
import { GetActiveMissionInputDto } from '@/modules/missions/usecase/get-active/get-active-mission.usecase.dto';
import { ListMissionVersionsInputDto } from '@/modules/missions/usecase/list-versions/list-mission-versions.usecase.dto';
import { PublishMissionInputDto } from '@/modules/missions/usecase/publish-mission/publish-mission.usecase.dto';
import { SaveMissionVersionInputDto } from '@/modules/missions/usecase/save-version/save-mission-version.usecase.dto';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class MissionsService {
  @Inject(MissionFacade)
  private readonly missionFacade: MissionFacade;

  async createMission(input: CreateMissionInputDto) {
    return this.missionFacade.createMission(input);
  }

  async saveVersion(input: SaveMissionVersionInputDto) {
    return this.missionFacade.saveVersion(input);
  }

  async publishMission(input: PublishMissionInputDto) {
    return this.missionFacade.publishMission(input);
  }

  async listVersions(input: ListMissionVersionsInputDto) {
    return this.missionFacade.listVersions(input);
  }

  async getActive(input: GetActiveMissionInputDto) {
    return this.missionFacade.getActive(input);
  }
}
