import { IsNotEmpty, IsString } from 'class-validator';
import { JacareDAGValidationErrors } from '../../types/jacare-flow.types';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';

export class ListMissionVersionsInputDto {
  @IsString({ message: 'O missionId deve ser um texto' })
  @IsNotEmpty({ message: 'O missionId é obrigatório' })
  missionId: string;

  @IsString({ message: 'O organizationId deve ser um texto' })
  @IsNotEmpty({ message: 'O organizationId é obrigatório' })
  organizationId: string;
}

export interface MissionVersionItemDto {
  id: string;
  missionId: string;
  hash: string;
  isValid: boolean;
  validationErrors: JacareDAGValidationErrors | null;
  authorId: string;
  createdAt: Date;
}

export interface ListMissionVersionsUseCaseInterface extends BaseUseCase {
  execute(input: ListMissionVersionsInputDto): Promise<MissionVersionItemDto[]>;
}
