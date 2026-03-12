import {
  CreateInputDto,
  CreateOutputDto,
} from '../usecase/create/create.usecase.dto';
import { DeleteInputDto } from '../usecase/delete/delete.usecase.dto';
import {
  SearchInputDto,
  SearchItemDto,
} from '../usecase/search/search.usecase.dto';

export interface EngineAuthFacadeInterface {
  create(input: CreateInputDto): Promise<CreateOutputDto>;
  delete(input: DeleteInputDto): Promise<void>;
  search(input: SearchInputDto): Promise<SearchItemDto[]>;
}
