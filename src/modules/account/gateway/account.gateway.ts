import { User } from '../domain/user.entity';
import { EMemberRole } from '@prisma/client';

/**
 * Dados do membro com informações do usuário, retornado pelas leituras do gateway.
 */
export interface MemberWithUser {
  memberId: string;
  userId: string;
  organizationId: string;
  role: EMemberRole;
  user: {
    id: string;
    email: string;
    name: string;
    avatarUrl: string | null;
  };
  organization: {
    id: string;
    name: string;
    slug: string;
    avatarUrl: string | null;
  };
}

/**
 * Dados necessários para criar uma organização durante o signup.
 */
export interface CreateOrganizationData {
  name: string;
  slug: string;
}

/**
 * Dados necessários para criar o vínculo membro durante o signup.
 */
export interface CreateMemberData {
  userId: string;
  organizationId: string;
  role: EMemberRole;
}

/**
 * Registro de membro retornado após criação.
 */
export interface MemberRecord {
  id: string;
  userId: string;
  organizationId: string;
  role: EMemberRole;
}

/**
 * Contrato de persistência do domínio de Account.
 * Gerencia User, Organization e Member em uma única interface
 * porque signup precisa criar os três de forma transacional.
 */
export interface AccountGateway {
  /** Busca um usuário pelo email. Retorna null se não existir. */
  findByEmail(email: string): Promise<User | null>;

  /** Persiste um novo usuário no banco. */
  createUser(user: User): Promise<void>;

  /** Cria uma nova organização e retorna seu id. */
  createOrganization(data: CreateOrganizationData): Promise<string>;

  /** Cria o vínculo entre usuário e organização. */
  createMember(data: CreateMemberData): Promise<MemberRecord>;

  /** Busca os dados do membro com informações do usuário e organização. */
  findMemberWithUser(memberId: string): Promise<MemberWithUser | null>;

  /** Busca o primeiro membro de um usuário (para login, quando não sabe o orgId). */
  findFirstMemberByUserId(userId: string): Promise<MemberRecord | null>;
}
