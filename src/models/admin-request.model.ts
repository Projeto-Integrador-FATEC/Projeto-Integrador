export type AdminRequestStatus = "PENDENTE" | "APROVADA" | "RECUSADA";

export interface AdminRequest {
  id: number;
  justificativa: string;
  status: AdminRequestStatus;
  userId: number;
  userName: string;
  userEmail: string;
  reviewedById: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminRequestData {
  justificativa: string;
}

export interface ReviewAdminRequestData {
  status: Exclude<AdminRequestStatus, "PENDENTE">;
}
