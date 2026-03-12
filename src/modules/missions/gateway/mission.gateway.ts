import { Mission } from '../domain/mission.entity';
import {
  JacareCanvasGraph,
  JacareMissionContract,
  JacareDAGValidationErrors,
} from '../types/jacare-flow.types';

/**
 * Dados necessários para persistir uma nova versão de missão.
 * O hash SHA-256 é gerado pelo SaveMissionVersionUseCase antes de chamar o gateway.
 */
export interface MissionVersionPersistData {
  missionId: string;
  /** SHA-256 do missionData compilado — chave de versionamento e cache */
  hash: string;
  /** Grafo bruto do React Flow — preservado para recarregar o Canvas */
  graphData: JacareCanvasGraph;
  /** JSON contrato compilado — servido ao Jacare Runtime (plugin Unreal) */
  missionData: JacareMissionContract;
  /** true = passou na validação DAG e pode ser publicado */
  isValid: boolean;
  /** null quando isValid=true; preenchido com erros DAG quando isValid=false */
  validationErrors: JacareDAGValidationErrors | null;
  /** ID do Member que salvou esta versão */
  authorId: string;
}

/**
 * Registro de versão de missão retornado pelas leituras do gateway.
 */
export interface MissionVersionRecord {
  id: string;
  missionId: string;
  hash: string;
  graphData: JacareCanvasGraph;
  missionData: JacareMissionContract;
  isValid: boolean;
  validationErrors: JacareDAGValidationErrors | null;
  authorId: string;
  createdAt: Date;
}

/**
 * Contrato de persistência do domínio de missões.
 * O repository implementa este contrato usando Prisma.
 * Os use cases dependem desta interface, não da implementação concreta.
 */
export interface MissionGateway {
  /** Busca uma missão pelo id semântico dentro de uma organização. Retorna null se não existir. */
  findById(missionId: string, organizationId: string): Promise<Mission | null>;

  /** Busca uma missão e lança NotFoundError se não existir. */
  findByIdOrFail(missionId: string, organizationId: string): Promise<Mission>;

  /** Persiste uma nova missão no banco (status DRAFT por padrão). */
  create(mission: Mission): Promise<void>;

  /** Atualiza campos mutáveis de uma missão existente (nome, status, activeHash, etc). */
  update(mission: Mission): Promise<void>;

  /** Persiste uma nova versão da missão com o hash SHA-256 gerado. */
  saveVersion(data: MissionVersionPersistData): Promise<MissionVersionRecord>;

  /** Retorna o histórico de versões de uma missão, do mais recente para o mais antigo. */
  findVersionsByMissionId(missionId: string): Promise<MissionVersionRecord[]>;

  /** Busca uma versão específica pelo seu hash SHA-256. Retorna null se não encontrar. */
  findVersionByHash(
    missionId: string,
    hash: string,
  ): Promise<MissionVersionRecord | null>;
}
