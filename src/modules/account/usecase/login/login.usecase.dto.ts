import BaseUseCase from '@/modules/@shared/usecase/base.usecase';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginInputDto {
  @IsEmail({}, { message: 'O email deve ser um endereço válido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email: string;

  @IsString({ message: 'A senha deve ser um texto' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  password: string;
}

export interface LoginOutputDto {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  organization: {
    id: string;
    role: string;
  };
  memberId: string;
}

export interface LoginUseCaseInterface extends BaseUseCase {
  execute(input: LoginInputDto): Promise<LoginOutputDto>;
}
