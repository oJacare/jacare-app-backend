import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiKey } from '../api-key.entity';
import { Notification } from '@/modules/@shared/domain/entity/validators/notification';
import { ClassValidatorFields } from '@/modules/@shared/domain/entity/validators/class-validator-fields';

export class ApiKeyRules {
  @IsString({
    message: 'O nome da API Key deve ser um texto',
    groups: ['create'],
  })
  @IsNotEmpty({
    message: 'O nome da API Key é obrigatório',
    groups: ['create'],
  })
  @Length(2, 100, {
    message: 'O nome deve ter entre 2 e 100 caracteres',
    groups: ['create'],
  })
  name: string;

  @IsString({
    message: 'O organizationId deve ser um texto',
    groups: ['create'],
  })
  @IsNotEmpty({
    message: 'O organizationId é obrigatório',
    groups: ['create'],
  })
  organizationId: string;

  @IsString({
    message: 'O keyHash deve ser um texto',
    groups: ['create'],
  })
  @IsNotEmpty({
    message: 'O keyHash é obrigatório',
    groups: ['create'],
  })
  keyHash: string;

  @IsString({
    message: 'O prefix deve ser um texto',
    groups: ['create'],
  })
  @IsNotEmpty({
    message: 'O prefix é obrigatório',
    groups: ['create'],
  })
  prefix: string;

  constructor(apiKey: ApiKey) {
    Object.assign(this, apiKey.toJSON());
  }
}

export class ApiKeyValidator extends ClassValidatorFields {
  validate(
    notification: Notification,
    data: ApiKey,
    fields: string[],
  ): boolean {
    const rules = new ApiKeyRules(data);
    return super.validate(
      notification,
      rules,
      fields?.length ? fields : ['create'],
    );
  }
}

export default class ApiKeyValidatorFactory {
  static create(): ApiKeyValidator {
    return new ApiKeyValidator();
  }
}
