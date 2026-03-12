import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateInputDto {
  @IsString({ message: 'O nome da API Key deve ser um texto' })
  @IsNotEmpty({ message: 'O nome da API Key é obrigatório' })
  @Length(2, 100, { message: 'O nome deve ter entre 2 e 100 caracteres' })
  name: string;

  @IsString({ message: 'O organizationId deve ser um texto' })
  @IsNotEmpty({ message: 'O organizationId é obrigatório' })
  organizationId: string;

  @IsOptional()
  expiresAt?: Date | null;
}

export interface CreateOutputDto {
  id: string;
  name: string;
  prefix: string;
  rawKey: string;
  createdAt: Date;
}

export interface CreateUseCaseInterface extends BaseUseCase {
  execute(input: CreateInputDto): Promise<CreateOutputDto>;
}
