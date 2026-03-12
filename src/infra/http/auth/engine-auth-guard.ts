import { createHash } from 'crypto';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import prisma from '@/infra/database/prisma.instance';

export interface EngineAuthPayload {
  organizationId: string;
}

@Injectable()
export class EngineAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const rawKey = request.headers['x-api-key'];

    if (!rawKey || typeof rawKey !== 'string') {
      throw new UnauthorizedException('Engine API Key não fornecida.');
    }

    const keyHash = createHash('sha256').update(rawKey).digest('hex');

    const keyRecord = await prisma.organizationApiKey.findFirst({
      where: {
        keyHash,
        revokedAt: null,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      select: { id: true, organizationId: true },
    });

    if (!keyRecord) {
      throw new UnauthorizedException('Engine API Key inválida ou revogada.');
    }

    request['engine'] = {
      organizationId: keyRecord.organizationId,
    } satisfies EngineAuthPayload;

    prisma.organizationApiKey
      .update({
        where: { id: keyRecord.id },
        data: { lastUsedAt: new Date() },
      })
      .catch(() => {});

    return true;
  }
}
