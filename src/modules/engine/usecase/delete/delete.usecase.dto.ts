import BaseUseCase from '@/modules/@shared/usecase/base.usecase';

export interface DeleteInputDto {
  id: string;
  organizationId: string;
}

export interface DeleteUseCaseInterface extends BaseUseCase {
  execute(input: DeleteInputDto): Promise<void>;
}
