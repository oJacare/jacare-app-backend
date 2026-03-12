/**
 * Jacare Flow — Domain Types
 *
 * Tipos centrais que representam o contrato de dados entre os três pilares:
 * - Jacare Canvas (frontend React Flow)
 * - Jacare Maestro (backend NestJS)
 * - Jacare Runtime (plugin Unreal C++)
 *
 * Node Types seguem o padrão de Gameplay Tags da Unreal Engine: "Categoria.Acao"
 * Exemplos: "Spawn.Actor", "Objective.Kill", "Condition.And", "Flow.Branch"
 */

export type JacareNodeGameplayTag =
  | 'Spawn.Actor'
  | 'Objective.Kill'
  | 'Objective.Goto'
  | 'Objective.Collect'
  | 'Objective.Interact'
  | 'Condition.And'
  | 'Condition.Or'
  | 'Condition.Not'
  | 'Condition.Time'
  | 'Condition.Faction'
  | 'Dialogue.Tree'
  | 'Dialogue.Node'
  | 'Cinematic.Play'
  | 'Audio.Play'
  | 'Reward.Give'
  | 'Flag.Set'
  | 'Flow.Wait'
  | 'Flow.Branch'
  | 'Flow.Custom'
  | (string & {});

// ---------------------------------------------------------------------------
// Jacare Canvas Graph — grafo bruto vindo do React Flow (Jacare Canvas)
// Persistido em MissionVersion.graphData para recarregar o editor
// ---------------------------------------------------------------------------

export interface JacareCanvasNodePosition {
  x: number;
  y: number;
}

export interface JacareCanvasNode {
  /** ID único do nó no React Flow (ex: "node_01", "n02") */
  id: string;
  /** Tipo do nó — mapeia para JacareNodeGameplayTag */
  type: JacareNodeGameplayTag;
  position: JacareCanvasNodePosition;
  /** Propriedades específicas do nó configuradas no painel do Canvas */
  data: Record<string, unknown>;
}

export interface JacareCanvasEdge {
  /** ID único da aresta no React Flow */
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

/**
 * Grafo bruto salvo pelo Jacare Canvas (React Flow).
 * Preservado no banco para permitir recarregar o editor sem perda de layout.
 */
export interface JacareCanvasGraph {
  nodes: JacareCanvasNode[];
  edges: JacareCanvasEdge[];
}

// ---------------------------------------------------------------------------
// Jacare Mission Contract — JSON compilado servido ao Jacare Runtime (Unreal)
// Formato estrito esperado pelo plugin C++
// ---------------------------------------------------------------------------

/**
 * Definição de um nó no contrato compilado para a Unreal.
 * Cada nó possui seu type (Gameplay Tag) e on_success com os IDs dos próximos nós.
 * Campos extras variam por Node Type (ex: class_path para Spawn.Actor).
 */
export interface JacareNodeDefinition {
  /** Gameplay Tag que identifica o Node Type: "Spawn.Actor", "Objective.Kill", etc. */
  type: JacareNodeGameplayTag;
  /** IDs dos nós a serem executados após este completar com sucesso */
  on_success?: string[];
  /** Quaisquer propriedades específicas do Node Type */
  [nodeProperty: string]: unknown;
}

export interface JacareMissionMeta {
  /** Versão semântica do schema do contrato */
  version: string;
  /** SHA-256 do mission_data — usado pelo Runtime para invalidar cache */
  hash: string;
}

export interface JacareMissionGraph {
  /** ID do nó inicial da missão */
  start_node: string;
  /** Mapa de node_id → definição do nó */
  nodes: Record<string, JacareNodeDefinition>;
}

/**
 * Contrato JSON compilado pelo Jacare Maestro e consumido pelo Jacare Runtime.
 * Gerado a partir do JacareCanvasGraph após validação DAG.
 * Este é o formato exato esperado pelo plugin C++ (UJacareMissionSubsystem).
 */
export interface JacareMissionContract {
  /** ID semântico da missão — snake_case (ex: "qst_old_country") */
  mission_id: string;
  meta: JacareMissionMeta;
  graph: JacareMissionGraph;
}

// ---------------------------------------------------------------------------
// DAG Validation — erros retornados pelo algoritmo de validação
// ---------------------------------------------------------------------------

export type JacareDAGErrorType =
  | 'LOOP_DETECTED'
  | 'DEAD_END'
  | 'MISSING_CONNECTION'
  | 'INVALID_NODE_TYPE'
  | 'UNREACHABLE_NODE';

export interface JacareDAGValidationError {
  /** ID do nó culpado — usado pelo Canvas para pintar o nó de vermelho */
  nodeId: string;
  /** Tipo do erro para categorização no frontend */
  errorType: JacareDAGErrorType;
  /** Mensagem descritiva para o Designer */
  message: string;
}

/** Lista de erros retornada pela validação DAG — null quando isValid=true */
export type JacareDAGValidationErrors = JacareDAGValidationError[];
