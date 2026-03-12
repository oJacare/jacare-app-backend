import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  JacareCanvasGraph,
  JacareMissionContract,
  JacareDAGValidationErrors,
} from '../../types/jacare-flow.types';
import BaseUseCase from '@/modules/@shared/usecase/base.usecase';

export class SaveMissionVersionInputDto {
  @IsString({ message: 'O missionId deve ser um texto' })
  @IsNotEmpty({ message: 'O missionId é obrigatório' })
  missionId: string;

  @IsString({ message: 'O organizationId deve ser um texto' })
  @IsNotEmpty({ message: 'O organizationId é obrigatório' })
  organizationId: string;

  @IsObject({
    message: 'O graphData deve ser um objeto JSON válido (JacareCanvasGraph)',
  })
  @IsNotEmpty({ message: 'O graphData é obrigatório' })
  graphData: JacareCanvasGraph;

  @IsObject({
    message:
      'O missionData deve ser um objeto JSON válido (JacareMissionContract)',
  })
  @IsNotEmpty({ message: 'O missionData é obrigatório' })
  missionData: JacareMissionContract;

  @IsBoolean({ message: 'isValid deve ser verdadeiro ou falso' })
  isValid: boolean;

  @IsOptional()
  validationErrors?: JacareDAGValidationErrors | null;

  @IsString({ message: 'O authorId deve ser um texto' })
  @IsNotEmpty({ message: 'O authorId é obrigatório' })
  authorId: string;
}

export interface SaveMissionVersionOutputDto {
  id: string;
  missionId: string;
  /** SHA-256 gerado a partir do missionData — retornado ao Canvas para exibição */
  hash: string;
  isValid: boolean;
  validationErrors: JacareDAGValidationErrors | null;
  createdAt: Date;
}

export interface SaveMissionVersionUseCaseInterface extends BaseUseCase {
  execute(
    input: SaveMissionVersionInputDto,
  ): Promise<SaveMissionVersionOutputDto>;
}
