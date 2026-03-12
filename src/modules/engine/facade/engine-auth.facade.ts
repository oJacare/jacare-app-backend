import {
  CreateUseCaseInterface,
  CreateInputDto,
  CreateOutputDto,
} from '../usecase/create/create.usecase.dto';
import {
  DeleteUseCaseInterface,
  DeleteInputDto,
} from '../usecase/delete/delete.usecase.dto';
import {
  SearchUseCaseInterface,
  SearchInputDto,
  SearchItemDto,
} from '../usecase/search/search.usecase.dto';
import { EngineAuthFacadeInterface } from './engine-auth.facade.dto';

export class EngineAuthFacade implements EngineAuthFacadeInterface {
  constructor(
    private readonly createUseCase: CreateUseCaseInterface,
    private readonly deleteUseCase: DeleteUseCaseInterface,
    private readonly searchUseCase: SearchUseCaseInterface,
  ) {}

  async create(input: CreateInputDto): Promise<CreateOutputDto> {
    return this.createUseCase.execute(input);
  }

  async delete(input: DeleteInputDto): Promise<void> {
    return this.deleteUseCase.execute(input);
  }

  async search(input: SearchInputDto): Promise<SearchItemDto[]> {
    return this.searchUseCase.execute(input);
  }
}
