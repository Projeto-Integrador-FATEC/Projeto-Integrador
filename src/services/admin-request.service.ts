import { HttpError } from "@/lib/http-error";
import {
  AdminRequest,
  CreateAdminRequestData,
  ReviewAdminRequestData,
} from "@/models/admin-request.model";
import { IAdminRequestRepository } from "@/repositories/interfaces/admin-request-repository.interface";
import { IUserRepository } from "@/repositories/interfaces/user-repository.interface";
import { IAdminRequestService } from "./interfaces/admin-request-service.interface";

export class AdminRequestService implements IAdminRequestService {
  constructor(
    private readonly adminRequestRepository: IAdminRequestRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async create(userId: number, data: CreateAdminRequestData): Promise<AdminRequest> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new HttpError("Usuário não encontrado", 404);
    }

    if (user.role === "ADMIN") {
      throw new HttpError("Você já é administrador", 400);
    }

    const pending = await this.adminRequestRepository.findPendingByUserId(userId);

    if (pending) {
      throw new HttpError("Você já possui um chamado em análise", 409);
    }

    return this.adminRequestRepository.create(userId, data.justificativa.trim());
  }

  async getMine(userId: number): Promise<AdminRequest | null> {
    return this.adminRequestRepository.findLatestByUserId(userId);
  }

  async listAll(): Promise<AdminRequest[]> {
    const requests = await this.adminRequestRepository.findAll();
    const order = { PENDENTE: 0, APROVADA: 1, RECUSADA: 2 };

    return [...requests].sort((a, b) => order[a.status] - order[b.status]);
  }

  async review(id: number, reviewerId: number, data: ReviewAdminRequestData): Promise<AdminRequest> {
    const request = await this.adminRequestRepository.findById(id);

    if (!request) {
      throw new HttpError("Chamado não encontrado", 404);
    }

    if (request.status !== "PENDENTE") {
      throw new HttpError("Este chamado já foi analisado", 409);
    }

    if (request.userId === reviewerId) {
      throw new HttpError("Você não pode analisar o próprio chamado", 403);
    }

    const reviewed = await this.adminRequestRepository.review(id, data.status, reviewerId);

    if (data.status === "APROVADA") {
      await this.userRepository.updateRole(request.userId, "ADMIN");
    }

    return reviewed;
  }
}
