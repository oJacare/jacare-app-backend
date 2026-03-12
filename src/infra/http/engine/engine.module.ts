import { Module } from '@nestjs/common';
import { JacareAuthModule } from '../auth/auth.module';
import { MissionsModule } from '../missions/missions.module';
import { EngineController } from './engine.controller';
import { EngineApiKeysController } from './engine-api-keys.controller';
import { EngineApiKeysService } from './engine-api-keys.service';
import { EngineAuthFacade } from '@/modules/engine/facade/engine-auth.facade';
import { EngineAuthFacadeFactory } from '@/modules/engine/factory/facade.factory';

@Module({
  imports: [JacareAuthModule, MissionsModule],
  controllers: [EngineController, EngineApiKeysController],
  providers: [
    EngineApiKeysService,
    {
      provide: EngineAuthFacade,
      useFactory: () => EngineAuthFacadeFactory.create(),
    },
  ],
})
export class EngineModule {}
