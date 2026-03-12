import {
  SignupInputDto,
  SignupOutputDto,
} from '../usecase/signup/signup.usecase.dto';
import {
  LoginInputDto,
  LoginOutputDto,
} from '../usecase/login/login.usecase.dto';
import {
  FindOneInputDto,
  FindOneOutputDto,
} from '../usecase/find-one/find-one.usecase.dto';

export interface AccountFacadeInterface {
  signup(input: SignupInputDto): Promise<SignupOutputDto>;
  login(input: LoginInputDto): Promise<LoginOutputDto>;
  findOne(input: FindOneInputDto): Promise<FindOneOutputDto>;
}
