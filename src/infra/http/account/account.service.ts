import { Inject, Injectable } from '@nestjs/common';
import { AccountFacade } from '@/modules/account/facade/account.facade';
import { SignupInputDto } from '@/modules/account/usecase/signup/signup.usecase.dto';
import { LoginInputDto } from '@/modules/account/usecase/login/login.usecase.dto';
import { FindOneInputDto } from '@/modules/account/usecase/find-one/find-one.usecase.dto';

@Injectable()
export class AccountService {
  @Inject(AccountFacade)
  private readonly accountFacade: AccountFacade;

  async signup(input: SignupInputDto) {
    return this.accountFacade.signup(input);
  }

  async login(input: LoginInputDto) {
    return this.accountFacade.login(input);
  }

  async findOne(input: FindOneInputDto) {
    return this.accountFacade.findOne(input);
  }
}
