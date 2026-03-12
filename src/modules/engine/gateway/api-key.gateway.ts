import { ApiKey } from '../domain/api-key.entity';

/**
 * Registro de API Key retornado pelas leituras do gateway.
 */
export interface ApiKeyRecord {
  id: string;
  organizationId: string;
  name: string;
  keyHash: string;
  prefix: string;
  lastUsedAt: Date | null;
  expiresAt: Date | null;
  revokedAt: Date | null;
  createdAt: Date;
}

/**
 * Contrato de persistência do domínio de Engine Auth.
 * O repository implementa este contrato usando Prisma.
 * Os use cases dependem desta interface, não da implementação concreta.
 */
export interface ApiKeyGateway {
  /** Busca uma API Key válida pelo hash SHA-256. Ignora chaves revogadas e expiradas. */
  findByHash(keyHash: string): Promise<ApiKey | null>;

  /** Busca uma API Key pelo id dentro de uma organização. */
  findById(id: string, organizationId: string): Promise<ApiKey | null>;

  /** Busca uma API Key e lança NotFoundError se não existir. */
  findByIdOrFail(id: string, organizationId: string): Promise<ApiKey>;

  /** Retorna todas as API Keys de uma organização, da mais recente para a mais antiga. */
  findByOrganization(organizationId: string): Promise<ApiKey[]>;

  /** Persiste uma nova API Key no banco. */
  create(apiKey: ApiKey): Promise<void>;

  /** Atualiza campos mutáveis (revokedAt, lastUsedAt). */
  update(apiKey: ApiKey): Promise<void>;
}
