import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateMissionInputDto {
  @IsString({ message: 'O id da missão deve ser um texto' })
  @IsNotEmpty({ message: 'O id da missão é obrigatório' })
  @Matches(/^[a-z][a-z0-9_]*$/, {
    message:
      'O id deve ser snake_case, começar com letra (ex: qst_old_country)',
  })
  id: string;

  @IsString({ message: 'O nome deve ser um texto' })
  @IsNotEmpty({ message: 'O nome da missão é obrigatório' })
  @Length(2, 100, { message: 'O nome deve ter entre 2 e 100 caracteres' })
  name: string;

  @IsOptional()
  @IsString({ message: 'A descrição deve ser um texto' })
  description?: string;

  @IsString({ message: 'O organizationId deve ser um texto' })
  @IsNotEmpty({ message: 'O organizationId é obrigatório' })
  organizationId: string;

  @IsString({ message: 'O authorId deve ser um texto' })
  @IsNotEmpty({ message: 'O authorId é obrigatório' })
  authorId: string;
}

export interface CreateMissionOutputDto {
  id: string;
  name: string;
  description: string | null;
  status: string;
  activeHash: string | null;
  organizationId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMissionUseCaseInterface extends BaseUseCase {
  execute(input: CreateMissionInputDto): Promise<CreateMissionOutputDto>;
}
