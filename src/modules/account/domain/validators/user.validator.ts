import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { User } from '../user.entity';
import { Notification } from '@/modules/@shared/domain/entity/validators/notification';
import { ClassValidatorFields } from '@/modules/@shared/domain/entity/validators/class-validator-fields';

export class UserRules {
  @IsEmail(
    {},
    { message: 'O email deve ser um endereço válido', groups: ['create'] },
  )
  @IsNotEmpty({ message: 'O email é obrigatório', groups: ['create'] })
  email: string;

  @IsString({ message: 'O nome deve ser um texto', groups: ['create'] })
  @IsNotEmpty({ message: 'O nome é obrigatório', groups: ['create'] })
  @Length(2, 100, {
    message: 'O nome deve ter entre 2 e 100 caracteres',
    groups: ['create'],
  })
  name: string;

  @IsString({ message: 'A senha deve ser um texto', groups: ['create'] })
  @IsNotEmpty({ message: 'A senha é obrigatória', groups: ['create'] })
  password: string;

  constructor(user: User) {
    Object.assign(this, user.toJSON());
  }
}

export class UserValidator extends ClassValidatorFields {
  validate(notification: Notification, data: User, fields: string[]): boolean {
    const rules = new UserRules(data);
    return super.validate(
      notification,
      rules,
      fields?.length ? fields : ['create'],
    );
  }
}

export default class UserValidatorFactory {
  static create(): UserValidator {
    return new UserValidator();
  }
}
