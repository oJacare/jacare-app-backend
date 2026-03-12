import { EMissionStatus } from '@prisma/client';
import MissionValidatorFactory from './validators/mission.validator';
import { MissionCreatedEvent } from '../events/mission-created.event';
import { MissionPublishedEvent } from '../events/mission-published.event';
import { EntityValidationError } from '@/modules/@shared/domain/errors/unprocessable-entity.error';
import BaseEntity from '@/modules/@shared/domain/entity/base.entity';

export interface MissionProps {
  id: string;
  name: string;
  description?: string | null;
  status?: EMissionStatus;
  activeHash?: string | null;
  organizationId: string;
  authorId: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class Mission extends BaseEntity {
  private _name: string;
  private _description: string | null;
  private _status: EMissionStatus;
  private _activeHash: string | null;
  private _organizationId: string;
  private _authorId: string;

  constructor(props: MissionProps) {
    super(
      props.id,
      props.createdAt,
      props.updatedAt,
      props.deletedAt == null,
      props.deletedAt ?? undefined,
    );
    this._name = props.name;
    this._description = props.description ?? null;
    this._status = props.status ?? EMissionStatus.DRAFT;
    this._activeHash = props.activeHash ?? null;
    this._organizationId = props.organizationId;
    this._authorId = props.authorId;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | null {
    return this._description;
  }

  get status(): EMissionStatus {
    return this._status;
  }

  get activeHash(): string | null {
    return this._activeHash;
  }

  get organizationId(): string {
    return this._organizationId;
  }

  get authorId(): string {
    return this._authorId;
  }

  changeName(name: string): void {
    this._name = name;
    this.update();
  }

  changeDescription(description: string | null): void {
    this._description = description;
    this.update();
  }

  changeStatus(status: EMissionStatus): void {
    this._status = status;
    this.update();
  }

  publish(hash: string): void {
    this._activeHash = hash;
    this._status = EMissionStatus.APPROVED;
    this.update();
  }

  validate(fields?: string[]): void {
    const validator = MissionValidatorFactory.create();
    validator.validate(this._notification, this, fields ?? ['create']);
  }

  emitEvents(): void {
    this._eventDispatcher.dispatch(
      new MissionCreatedEvent(
        this._id,
        this._name,
        this._organizationId,
        this._authorId,
      ),
    );
  }

  emitPublishedEvent(): void {
    this._eventDispatcher.dispatch(
      new MissionPublishedEvent(
        this._id,
        this._activeHash!,
        this._organizationId,
      ),
    );
  }

  static create(props: MissionProps): Mission {
    const mission = new Mission(props);
    mission.validate();

    if (mission.notification.hasErrors()) {
      throw new EntityValidationError(mission.notification.toJSON());
    }

    return mission;
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      status: this._status,
      activeHash: this._activeHash,
      organizationId: this._organizationId,
      authorId: this._authorId,
      active: this._active,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
    };
  }
}
