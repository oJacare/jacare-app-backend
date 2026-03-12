import * as bcrypt from 'bcryptjs';
import { AccountGateway } from '../../gateway/account.gateway';
import { EntityValidationError } from '@/modules/@shared/domain/errors/unprocessable-entity.error';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';
import {
  LoginInputDto,
  LoginOutputDto,
  LoginUseCaseInterface,
} from './login.usecase.dto';

export class LoginUseCase implements LoginUseCaseInterface {
  constructor(
    private readonly accountRepository: AccountGateway,
    private readonly signToken: (payload: {
      memberId: string;
      organizationId: string;
      role: string;
    }) => string,
  ) {}

  async execute(input: LoginInputDto): Promise<LoginOutputDto> {
    const user = await this.accountRepository.findByEmail(input.email);

    if (!user) {
      throw new EntityValidationError([
        { credentials: ['Email ou senha inválidos.'] },
      ]);
    }

    const passwordMatch = bcrypt.compareSync(input.password, user.password);

    if (!passwordMatch) {
      throw new EntityValidationError([
        { credentials: ['Email ou senha inválidos.'] },
      ]);
    }

    const member = await this.accountRepository.findFirstMemberByUserId(
      user.id,
    );

    if (!member) {
      throw new NotFoundError(
        'Usuário não está vinculado a nenhuma organização.',
      );
    }

    const token = this.signToken({
      memberId: member.id,
      organizationId: member.organizationId,
      role: member.role,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      organization: {
        id: member.organizationId,
        role: member.role,
      },
      memberId: member.id,
    };
  }
}
