import { Module } from '@nestjs/common';
import { MissionsController } from './missions.controller';
import { MissionsService } from './missions.service';
import { JacareAuthModule } from '../auth/auth.module';
import { MissionFacade } from '@/modules/missions/facade/mission.facade';
import { MissionFacadeFactory } from '@/modules/missions/factory/facade.factory';

@Module({
  imports: [JacareAuthModule],
  controllers: [MissionsController],
  providers: [
    MissionsService,
    {
      provide: MissionFacade,
      useFactory: () => MissionFacadeFactory.create(),
    },
  ],
  exports: [MissionsService],
})
export class MissionsModule {}
