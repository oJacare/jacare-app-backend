import type {
  Mission as PrismaMissionRow,
  MissionVersion as PrismaMissionVersionRow,
  PrismaClient,
  Prisma,
} from '@prisma/client';
import { Mission, MissionProps } from '../domain/mission.entity';
import {
  MissionGateway,
  MissionVersionPersistData,
  MissionVersionRecord,
} from '../gateway/mission.gateway';
import {
  JacareCanvasGraph,
  JacareMissionContract,
  JacareDAGValidationErrors,
} from '../types/jacare-flow.types';
import { NotFoundError } from '@/modules/@shared/domain/errors/not-found.error';

export class MissionRepository implements MissionGateway {
  constructor(private readonly prisma: PrismaClient) {}

  private toDomainEntity(prismaRow: PrismaMissionRow): Mission {
    return new Mission({
      id: prismaRow.id,
      name: prismaRow.name,
      description: prismaRow.description,
      status: prismaRow.status,
      activeHash: prismaRow.activeHash,
      organizationId: prismaRow.organizationId,
      authorId: prismaRow.authorId,
      createdAt: prismaRow.createdAt,
      updatedAt: prismaRow.updatedAt,
      deletedAt: prismaRow.deletedAt ?? undefined,
    } satisfies MissionProps);
  }

  private toVersionRecord(
    prismaRow: PrismaMissionVersionRow,
  ): MissionVersionRecord {
    return {
      id: prismaRow.id,
      missionId: prismaRow.missionId,
      hash: prismaRow.hash,
      graphData: prismaRow.graphData as unknown as JacareCanvasGraph,
      missionData: prismaRow.missionData as unknown as JacareMissionContract,
      isValid: prismaRow.isValid,
      validationErrors:
        prismaRow.validationErrors as JacareDAGValidationErrors | null,
      authorId: prismaRow.authorId,
      createdAt: prismaRow.createdAt,
    };
  }

  async findById(
    missionId: string,
    organizationId: string,
  ): Promise<Mission | null> {
    const prismaRow = await this.prisma.mission.findFirst({
      where: { id: missionId, organizationId, deletedAt: null },
    });

    if (!prismaRow) return null;
    return this.toDomainEntity(prismaRow);
  }

  async findByIdOrFail(
    missionId: string,
    organizationId: string,
  ): Promise<Mission> {
    const mission = await this.findById(missionId, organizationId);

    if (!mission) {
      throw new NotFoundError(
        `Missão '${missionId}' não encontrada na organização '${organizationId}'.`,
      );
    }

    return mission;
  }

  async create(mission: Mission): Promise<void> {
    await this.prisma.mission.create({
      data: {
        id: mission.id,
        name: mission.name,
        description: mission.description,
        status: mission.status,
        activeHash: mission.activeHash,
        organizationId: mission.organizationId,
        authorId: mission.authorId,
        createdAt: mission.createdAt,
        updatedAt: mission.updatedAt,
      },
    });
  }

  async update(mission: Mission): Promise<void> {
    await this.prisma.mission.update({
      where: { id: mission.id },
      data: {
        name: mission.name,
        description: mission.description,
        status: mission.status,
        activeHash: mission.activeHash,
        updatedAt: mission.updatedAt,
        deletedAt: mission.deletedAt,
      },
    });
  }

  async saveVersion(
    data: MissionVersionPersistData,
  ): Promise<MissionVersionRecord> {
    const prismaRow = await this.prisma.missionVersion.create({
      data: {
        missionId: data.missionId,
        hash: data.hash,
        graphData: data.graphData as unknown as Prisma.InputJsonValue,
        missionData: data.missionData as unknown as Prisma.InputJsonValue,
        isValid: data.isValid,
        validationErrors: (data.validationErrors ?? undefined) as
          | Prisma.InputJsonValue
          | undefined,
        authorId: data.authorId,
      },
    });

    return this.toVersionRecord(prismaRow);
  }

  async findVersionsByMissionId(
    missionId: string,
  ): Promise<MissionVersionRecord[]> {
    const prismaRows = await this.prisma.missionVersion.findMany({
      where: { missionId },
      orderBy: { createdAt: 'desc' },
    });

    return prismaRows.map((row) => this.toVersionRecord(row));
  }

  async findVersionByHash(
    missionId: string,
    hash: string,
  ): Promise<MissionVersionRecord | null> {
    const prismaRow = await this.prisma.missionVersion.findFirst({
      where: { missionId, hash },
    });

    if (!prismaRow) return null;
    return this.toVersionRecord(prismaRow);
  }
}
