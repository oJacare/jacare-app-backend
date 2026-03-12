import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { IsNotEmpty, IsString } from 'class-validator';

export class PublishMissionInputDto {
  @IsString({ message: 'O missionId deve ser um texto' })
  @IsNotEmpty({ message: 'O missionId é obrigatório' })
  missionId: string;

  @IsString({ message: 'O organizationId deve ser um texto' })
  @IsNotEmpty({ message: 'O organizationId é obrigatório' })
  organizationId: string;

  @IsString({ message: 'O versionHash deve ser um texto' })
  @IsNotEmpty({ message: 'O versionHash é obrigatório' })
  versionHash: string;
}

export interface PublishMissionOutputDto {
  id: string;
  name: string;
  status: string;
  activeHash: string;
  updatedAt: Date;
}

export interface PublishMissionUseCaseInterface extends BaseUseCase {
  execute(input: PublishMissionInputDto): Promise<PublishMissionOutputDto>;
}
