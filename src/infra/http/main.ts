import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { EntityValidationErrorFilter } from './shared/errors/entity-validation.filter';
import { NotFoundErrorFilter } from './shared/errors/not-found.filter';
import exceptionFactory from './shared/errors/exception-factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory,
      errorHttpStatusCode: 422,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.useGlobalFilters(new EntityValidationErrorFilter());
  app.useGlobalFilters(new NotFoundErrorFilter());

  app.enableCors();

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
