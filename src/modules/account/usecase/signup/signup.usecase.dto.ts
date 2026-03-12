import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class SignupInputDto {
  @IsString({ message: 'O nome deve ser um texto' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @Length(2, 100, { message: 'O nome deve ter entre 2 e 100 caracteres' })
  name: string;

  @IsEmail({}, { message: 'O email deve ser um endereço válido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email: string;

  @IsString({ message: 'A senha deve ser um texto' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;

  @IsString({ message: 'O nome da organização deve ser um texto' })
  @IsNotEmpty({ message: 'O nome da organização é obrigatório' })
  @Length(2, 100, {
    message: 'O nome da organização deve ter entre 2 e 100 caracteres',
  })
  organizationName: string;
}

export interface SignupOutputDto {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  organization: {
    id: string;
    name: string;
    slug: string;
  };
  memberId: string;
}

export interface SignupUseCaseInterface extends BaseUseCase {
  execute(input: SignupInputDto): Promise<SignupOutputDto>;
}
