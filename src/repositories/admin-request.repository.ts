import { prisma } from "@/lib/prisma";
import { AdminRequest, AdminRequestStatus } from "@/models/admin-request.model";
import { IAdminRequestRepository } from "./interfaces/admin-request-repository.interface";
import { adminRequestInclude, toAdminRequest } from "./mappers";

export class AdminRequestRepository implements IAdminRequestRepository {
  async create(userId: number, justificativa: string): Promise<AdminRequest> {
    const row = await prisma.solicitacaoAdmin.create({
      data: { userId, justificativa },
      include: adminRequestInclude,
    });

    return toAdminRequest(row);
  }

  async findById(id: number): Promise<AdminRequest | null> {
    const row = await prisma.solicitacaoAdmin.findUnique({
      where: { id },
      include: adminRequestInclude,
    });

    return row ? toAdminRequest(row) : null;
  }

  async findPendingByUserId(userId: number): Promise<AdminRequest | null> {
    const row = await prisma.solicitacaoAdmin.findFirst({
      where: { userId, status: "PENDENTE" },
      include: adminRequestInclude,
      orderBy: { createdAt: "desc" },
    });

    return row ? toAdminRequest(row) : null;
  }

  async findLatestByUserId(userId: number): Promise<AdminRequest | null> {
    const row = await prisma.solicitacaoAdmin.findFirst({
      where: { userId },
      include: adminRequestInclude,
      orderBy: { createdAt: "desc" },
    });

    return row ? toAdminRequest(row) : null;
  }

  async findAll(): Promise<AdminRequest[]> {
    const rows = await prisma.solicitacaoAdmin.findMany({
      include: adminRequestInclude,
      orderBy: { createdAt: "desc" },
    });

    return rows.map(toAdminRequest);
  }

  async review(
    id: number,
    status: Exclude<AdminRequestStatus, "PENDENTE">,
    reviewedById: number
  ): Promise<AdminRequest> {
    const row = await prisma.solicitacaoAdmin.update({
      where: { id },
      data: { status, reviewedById },
      include: adminRequestInclude,
    });

    return toAdminRequest(row);
  }
}
