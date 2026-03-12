import { AccountGateway } from '../../gateway/account.gateway';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';
import {
  FindOneInputDto,
  FindOneOutputDto,
  FindOneUseCaseInterface,
} from './find-one.usecase.dto';

export class FindOneUseCase implements FindOneUseCaseInterface {
  constructor(private readonly accountRepository: AccountGateway) {}

  async execute(input: FindOneInputDto): Promise<FindOneOutputDto> {
    const memberWithUser = await this.accountRepository.findMemberWithUser(
      input.memberId,
    );

    if (!memberWithUser) {
      throw new NotFoundError('Membro não encontrado.');
    }

    return {
      memberId: memberWithUser.memberId,
      user: memberWithUser.user,
      organization: memberWithUser.organization,
      role: memberWithUser.role,
    };
  }
}
