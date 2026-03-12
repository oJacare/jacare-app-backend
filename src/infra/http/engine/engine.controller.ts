import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { EngineAuthGuard, EngineAuthPayload } from '../auth/engine-auth-guard';
import { MissionsService } from '../missions/missions.service';

@UseGuards(EngineAuthGuard)
@Controller('missions/engine')
export class EngineController {
  constructor(private readonly missionsService: MissionsService) {}

  // GET /missions/engine/:id/active
  @Get(':id/active')
  async getActive(
    @Param('id') missionId: string,
    @Request() req: { engine: EngineAuthPayload },
  ) {
    return this.missionsService.getActive({
      missionId,
      organizationId: req.engine.organizationId,
    });
  }
}
