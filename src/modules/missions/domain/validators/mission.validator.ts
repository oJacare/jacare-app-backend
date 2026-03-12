import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Mission } from '../mission.entity';
import { Notification } from '@/modules/@shared/domain/entity/validators/notification';
import { ClassValidatorFields } from '@/modules/@shared/domain/entity/validators/class-validator-fields';

export class MissionRules {
  @IsString({ message: 'O id da missão deve ser um texto', groups: ['create'] })
  @IsNotEmpty({ message: 'O id da missão é obrigatório', groups: ['create'] })
  @Matches(/^[a-z][a-z0-9_]*$/, {
    message: 'O id deve ser snake_case (ex: qst_old_country)',
    groups: ['create'],
  })
  id: string;

  @IsString({
    message: 'O nome da missão deve ser um texto',
    groups: ['create', 'update'],
  })
  @IsNotEmpty({
    message: 'O nome da missão é obrigatório',
    groups: ['create', 'update'],
  })
  @Length(2, 100, {
    message: 'O nome deve ter entre 2 e 100 caracteres',
    groups: ['create', 'update'],
  })
  name: string;

  @IsOptional({ groups: ['create', 'update'] })
  @IsString({
    message: 'A descrição deve ser um texto',
    groups: ['create', 'update'],
  })
  description?: string | null;

  @IsString({
    message: 'O organizationId deve ser um texto',
    groups: ['create'],
  })
  @IsNotEmpty({ message: 'O organizationId é obrigatório', groups: ['create'] })
  organizationId: string;

  @IsString({ message: 'O authorId deve ser um texto', groups: ['create'] })
  @IsNotEmpty({ message: 'O authorId é obrigatório', groups: ['create'] })
  authorId: string;

  constructor(mission: Mission) {
    Object.assign(this, mission.toJSON());
  }
}

export class MissionValidator extends ClassValidatorFields {
  validate(
    notification: Notification,
    data: Mission,
    fields: string[],
  ): boolean {
    const rules = new MissionRules(data);
    return super.validate(
      notification,
      rules,
      fields?.length ? fields : ['create'],
    );
  }
}

export default class MissionValidatorFactory {
  static create(): MissionValidator {
    return new MissionValidator();
  }
}
