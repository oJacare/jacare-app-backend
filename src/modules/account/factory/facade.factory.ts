import prisma from '@/infra/database/prisma.instance';
import { AccountRepository } from '../repository/account.repository';
import { SignupUseCase } from '../usecase/signup/signup.usecase';
import { LoginUseCase } from '../usecase/login/login.usecase';
import { FindOneUseCase } from '../usecase/find-one/find-one.usecase';
import { AccountFacade } from '../facade/account.facade';

export type SignTokenFn = (payload: {
  memberId: string;
  organizationId: string;
  role: string;
}) => string;

export class AccountFacadeFactory {
  static create(signToken: SignTokenFn): AccountFacade {
    const repository = new AccountRepository(prisma);

    const signupUseCase = new SignupUseCase(repository, signToken);
    const loginUseCase = new LoginUseCase(repository, signToken);
    const findOneUseCase = new FindOneUseCase(repository);

    return new AccountFacade(signupUseCase, loginUseCase, findOneUseCase);
  }
}
