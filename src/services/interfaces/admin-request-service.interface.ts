import {
  AdminRequest,
  CreateAdminRequestData,
  ReviewAdminRequestData,
} from "@/models/admin-request.model";

export interface IAdminRequestService {
  create(userId: number, data: CreateAdminRequestData): Promise<AdminRequest>;
  getMine(userId: number): Promise<AdminRequest | null>;
  listAll(): Promise<AdminRequest[]>;
  review(id: number, reviewerId: number, data: ReviewAdminRequestData): Promise<AdminRequest>;
}
