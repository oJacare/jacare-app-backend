import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetActiveMissionInputDto {
  @IsString({ message: 'O missionId deve ser um texto' })
  @IsNotEmpty({ message: 'O missionId é obrigatório' })
  missionId: string;

  @IsString({ message: 'O organizationId deve ser um texto' })
  @IsNotEmpty({ message: 'O organizationId é obrigatório' })
  organizationId: string;
}

export interface GetActiveMissionUseCaseInterface extends BaseUseCase {
  execute(input: GetActiveMissionInputDto): Promise<object>;
}
