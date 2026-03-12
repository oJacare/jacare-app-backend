import { Inject, Injectable } from '@nestjs/common';
import { EngineAuthFacade } from '@/modules/engine/facade/engine-auth.facade';
import { CreateInputDto } from '@/modules/engine/usecase/create/create.usecase.dto';
import { SearchInputDto } from '@/modules/engine/usecase/search/search.usecase.dto';
import { DeleteInputDto } from '@/modules/engine/usecase/delete/delete.usecase.dto';

@Injectable()
export class EngineApiKeysService {
  @Inject(EngineAuthFacade)
  private readonly engineAuthFacade: EngineAuthFacade;

  async create(input: CreateInputDto) {
    return this.engineAuthFacade.create(input);
  }

  async search(input: SearchInputDto) {
    return this.engineAuthFacade.search(input);
  }

  async delete(input: DeleteInputDto) {
    return this.engineAuthFacade.delete(input);
  }
}
