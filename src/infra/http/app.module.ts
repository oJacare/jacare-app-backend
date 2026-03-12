import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MissionsModule } from './missions/missions.module';
import { JacareAuthModule } from './auth/auth.module';
import { EngineModule } from './engine/engine.module';
import { AccountModule } from './account/account.module';

@Module({
  imports: [MissionsModule, JacareAuthModule, EngineModule, AccountModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
