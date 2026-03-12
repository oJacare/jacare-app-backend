import BaseEntity from '@/modules/@shared/domain/entity/base.entity';
import { EntityValidationError } from '@/modules/@shared/domain/errors/unprocessable-entity.error';
import UserValidatorFactory from './validators/user.validator';

export interface UserProps {
  id?: string;
  email: string;
  name: string;
  password: string;
  avatarUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class User extends BaseEntity {
  private _email: string;
  private _name: string;
  private _password: string;
  private _avatarUrl: string | null;

  constructor(props: UserProps) {
    super(
      props.id,
      props.createdAt,
      props.updatedAt,
      props.deletedAt == null,
      props.deletedAt ?? undefined,
    );
    this._email = props.email;
    this._name = props.name;
    this._password = props.password;
    this._avatarUrl = props.avatarUrl ?? null;
  }

  get email(): string {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  get password(): string {
    return this._password;
  }

  get avatarUrl(): string | null {
    return this._avatarUrl;
  }

  changeName(name: string): void {
    this._name = name;
    this.update();
  }

  changeEmail(email: string): void {
    this._email = email;
    this.update();
  }

  changePassword(hashedPassword: string): void {
    this._password = hashedPassword;
    this.update();
  }

  validate(fields?: string[]): void {
    const validator = UserValidatorFactory.create();
    validator.validate(this._notification, this, fields ?? ['create']);
  }

  emitEvents(): void {}

  static create(props: UserProps): User {
    const user = new User(props);
    user.validate();

    if (user.notification.hasErrors()) {
      throw new EntityValidationError(user.notification.toJSON());
    }

    return user;
  }

  toJSON() {
    return {
      id: this._id,
      email: this._email,
      name: this._name,
      password: this._password,
      avatarUrl: this._avatarUrl,
      active: this._active,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
    };
  }
}
