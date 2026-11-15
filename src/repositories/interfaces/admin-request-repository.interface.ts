import { AdminRequest, AdminRequestStatus } from "@/models/admin-request.model";

export interface IAdminRequestRepository {
  create(userId: number, justificativa: string): Promise<AdminRequest>;
  findById(id: number): Promise<AdminRequest | null>;
  findPendingByUserId(userId: number): Promise<AdminRequest | null>;
  findLatestByUserId(userId: number): Promise<AdminRequest | null>;
  findAll(): Promise<AdminRequest[]>;
  review(id: number, status: Exclude<AdminRequestStatus, "PENDENTE">, reviewedById: number): Promise<AdminRequest>;
}
