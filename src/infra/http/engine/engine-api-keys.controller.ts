import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, JwtPayload } from '../auth/auth-guard';
import { RolesGuard } from '../auth/roles-guard';
import { Roles } from '../shared/roles.decorator';
import { EngineApiKeysService } from './engine-api-keys.service';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

class CreateApiKeyBodyDto {
  @IsString({ message: 'O nome da API Key deve ser um texto' })
  @IsNotEmpty({ message: 'O nome da API Key é obrigatório' })
  @Length(2, 100, { message: 'O nome deve ter entre 2 e 100 caracteres' })
  name: string;

  @IsOptional()
  expiresAt?: Date;
}

@UseGuards(AuthGuard, RolesGuard)
@Controller('api-keys')
export class EngineApiKeysController {
  constructor(private readonly engineApiKeysService: EngineApiKeysService) {}

  // POST /api-keys
  @Post()
  @Roles({ role: 'ADMIN' })
  async create(
    @Request() req: { user: JwtPayload },
    @Body() body: CreateApiKeyBodyDto,
  ) {
    return this.engineApiKeysService.create({
      organizationId: req.user.organizationId,
      name: body.name,
      expiresAt: body.expiresAt,
    });
  }

  // GET /api-keys
  @Get()
  @Roles({ role: 'ADMIN' })
  async search(@Request() req: { user: JwtPayload }) {
    return this.engineApiKeysService.search({
      organizationId: req.user.organizationId,
    });
  }

  // DELETE /api-keys/:id
  @Delete(':id')
  @HttpCode(204)
  @Roles({ role: 'ADMIN' })
  async delete(@Param('id') id: string, @Request() req: { user: JwtPayload }) {
    await this.engineApiKeysService.delete({
      id,
      organizationId: req.user.organizationId,
    });
  }
}
