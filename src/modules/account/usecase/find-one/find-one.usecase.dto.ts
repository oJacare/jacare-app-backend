import BaseUseCase from '@/modules/@shared/usecase/base.usecase';

export interface FindOneInputDto {
  memberId: string;
}

export interface FindOneOutputDto {
  memberId: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatarUrl: string | null;
  };
  organization: {
    id: string;
    name: string;
    slug: string;
    avatarUrl: string | null;
  };
  role: string;
}

export interface FindOneUseCaseInterface extends BaseUseCase {
  execute(input: FindOneInputDto): Promise<FindOneOutputDto>;
}
