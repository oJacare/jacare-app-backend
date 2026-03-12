import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MissionsService } from './missions.service';
import { AuthGuard, JwtPayload } from '../auth/auth-guard';
import { RolesGuard } from '../auth/roles-guard';
import { Roles } from '../shared/roles.decorator';
import { PublishMissionInputDto } from '@/modules/missions/usecase/publish-mission/publish-mission.usecase.dto';
import { SaveMissionVersionInputDto } from '@/modules/missions/usecase/save-version/save-mission-version.usecase.dto';
import { CreateMissionInputDto } from '@/modules/missions/usecase/create-mission/create-mission.usecase.dto';

@UseGuards(AuthGuard, RolesGuard)
@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  // POST /missions
  @Post()
  @Roles({ role: 'DESIGNER' })
  async createMission(
    @Request() req: { user: JwtPayload },
    @Body() body: CreateMissionInputDto,
  ) {
    return this.missionsService.createMission({
      ...body,
      organizationId: req.user.organizationId,
      authorId: req.user.memberId,
    });
  }

  // POST /missions/:id/versions
  @Post(':id/versions')
  @Roles({ role: 'DESIGNER' })
  async saveVersion(
    @Param('id') missionId: string,
    @Request() req: { user: JwtPayload },
    @Body()
    body: Omit<
      SaveMissionVersionInputDto,
      'missionId' | 'organizationId' | 'authorId'
    >,
  ) {
    return this.missionsService.saveVersion({
      ...body,
      missionId,
      organizationId: req.user.organizationId,
      authorId: req.user.memberId,
    });
  }

  // PUT /missions/:id/publish
  @Put(':id/publish')
  @HttpCode(200)
  @Roles({ role: 'DESIGNER' })
  async publishMission(
    @Param('id') missionId: string,
    @Request() req: { user: JwtPayload },
    @Body() body: Pick<PublishMissionInputDto, 'versionHash'>,
  ) {
    return this.missionsService.publishMission({
      missionId,
      organizationId: req.user.organizationId,
      versionHash: body.versionHash,
    });
  }

  // GET /missions/:id/versions
  @Get(':id/versions')
  @Roles({ role: 'VIEWER' })
  async listVersions(
    @Param('id') missionId: string,
    @Request() req: { user: JwtPayload },
  ) {
    return this.missionsService.listVersions({
      missionId,
      organizationId: req.user.organizationId,
    });
  }

  // GET /missions/:id/active
  @Get(':id/active')
  @Roles({ role: 'VIEWER' })
  async getActive(
    @Param('id') missionId: string,
    @Request() req: { user: JwtPayload },
  ) {
    return this.missionsService.getActive({
      missionId,
      organizationId: req.user.organizationId,
    });
  }
}
