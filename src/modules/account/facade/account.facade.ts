import {
  SignupUseCaseInterface,
  SignupInputDto,
  SignupOutputDto,
} from '../usecase/signup/signup.usecase.dto';
import {
  LoginUseCaseInterface,
  LoginInputDto,
  LoginOutputDto,
} from '../usecase/login/login.usecase.dto';
import {
  FindOneUseCaseInterface,
  FindOneInputDto,
  FindOneOutputDto,
} from '../usecase/find-one/find-one.usecase.dto';
import { AccountFacadeInterface } from './account.facade.dto';

export class AccountFacade implements AccountFacadeInterface {
  constructor(
    private readonly signupUseCase: SignupUseCaseInterface,
    private readonly loginUseCase: LoginUseCaseInterface,
    private readonly findOneUseCase: FindOneUseCaseInterface,
  ) {}

  async signup(input: SignupInputDto): Promise<SignupOutputDto> {
    return this.signupUseCase.execute(input);
  }

  async login(input: LoginInputDto): Promise<LoginOutputDto> {
    return this.loginUseCase.execute(input);
  }

  async findOne(input: FindOneInputDto): Promise<FindOneOutputDto> {
    return this.findOneUseCase.execute(input);
  }
}
