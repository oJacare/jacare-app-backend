import BaseUseCase from '@/modules/@shared/usecase/base.usecase';

export interface SearchInputDto {
  organizationId: string;
}

export interface SearchItemDto {
  id: string;
  name: string;
  prefix: string;
  lastUsedAt: Date | null;
  expiresAt: Date | null;
  revokedAt: Date | null;
  createdAt: Date;
}

export interface SearchUseCaseInterface extends BaseUseCase {
  execute(input: SearchInputDto): Promise<SearchItemDto[]>;
}
