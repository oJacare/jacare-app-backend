import { FieldsErrors } from '../entity/validators/validator-fields-interface';

export abstract class BaseValidationError extends Error {
  public status: number;

  constructor(
    public error: FieldsErrors[],
    message = 'Não foi possível processar a requisição com os parâmetros fornecidos',
  ) {
    super(message);
    this.name = 'UnprocessableEntity';
    this.status = 422;
  }

  count() {
    return Object.keys(this.error).length;
  }
}

export class EntityValidationError extends BaseValidationError {
  constructor(public error: FieldsErrors[]) {
    super(
      error,
      'Não foi possível processar a requisição com os parâmetros fornecidos',
    );
    this.name = 'EntityValidationError';
  }
}
