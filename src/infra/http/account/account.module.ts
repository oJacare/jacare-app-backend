import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JacareAuthModule } from '../auth/auth.module';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AccountFacade } from '@/modules/account/facade/account.facade';
import { AccountFacadeFactory } from '@/modules/account/factory/facade.factory';

@Module({
  imports: [JacareAuthModule],
  controllers: [AccountController],
  providers: [
    AccountService,
    {
      provide: AccountFacade,
      useFactory: (jwtService: JwtService) => {
        const signToken = (payload: {
          memberId: string;
          organizationId: string;
          role: string;
        }) => jwtService.sign(payload);

        return AccountFacadeFactory.create(signToken);
      },
      inject: [JwtService],
    },
  ],
})
export class AccountModule {}
