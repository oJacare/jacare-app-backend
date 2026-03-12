import { UnprocessableEntityException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export default function exceptionFactory(
  errors: ValidationError[],
): UnprocessableEntityException {
  const result = errors.map((error) => ({
    [error.property]: Object.values(error.constraints ?? {}),
  }));

  return new UnprocessableEntityException(result);
}
