import { Notification } from './notification';

export type FieldsErrors = { [fieldName: string]: string[] } | string;

export interface IValidatorFields {
  /**
   * @param notification
   * @param entityData
   * @param validationGroups
   */
  validate(
    notification: Notification,
    entityData: unknown,
    validationGroups: string[],
  ): boolean;
}
