import prisma from '@/infra/database/prisma.instance';
import { ApiKeyRepository } from '../repository/api-key.repository';
import { CreateUseCase } from '../usecase/create/create.usecase';
import { DeleteUseCase } from '../usecase/delete/delete.usecase';
import { SearchUseCase } from '../usecase/search/search.usecase';
import { EngineAuthFacade } from '../facade/engine-auth.facade';

export class EngineAuthFacadeFactory {
  static create(): EngineAuthFacade {
    const repository = new ApiKeyRepository(prisma);

    const createUseCase = new CreateUseCase(repository);
    const deleteUseCase = new DeleteUseCase(repository);
    const searchUseCase = new SearchUseCase(repository);

    return new EngineAuthFacade(createUseCase, deleteUseCase, searchUseCase);
  }
}
