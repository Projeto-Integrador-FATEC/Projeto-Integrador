import { AdminRequestService } from "@/services/admin-request.service";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { admin, aluno } from "../support/fixtures";

const pending = {
  id: 1,
  justificativa: "Preciso cadastrar cursos da minha instituição parceira.",
  status: "PENDENTE" as const,
  userId: aluno.id,
  userName: aluno.name,
  userEmail: aluno.email,
  reviewedById: null,
  createdAt: "2026-11-15T00:00:00.000Z",
  updatedAt: "2026-11-15T00:00:00.000Z",
};

describe("AdminRequestService", () => {
  const adminRequestRepository = {
    create: vi.fn(),
    findById: vi.fn(),
    findPendingByUserId: vi.fn(),
    findLatestByUserId: vi.fn(),
    findAll: vi.fn(),
    review: vi.fn(),
  };
  const userRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    findByEmail: vi.fn(),
    updateRole: vi.fn(),
  };
  const service = new AdminRequestService(adminRequestRepository, userRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("impede aluno com chamado pendente de abrir outro", async () => {
    userRepository.findById.mockResolvedValue(aluno);
    adminRequestRepository.findPendingByUserId.mockResolvedValue(pending);

    await expect(service.create(aluno.id, { justificativa: pending.justificativa })).rejects.toMatchObject({
      status: 409,
    });
  });

  it("aprova o chamado e promove o usuário", async () => {
    adminRequestRepository.findById.mockResolvedValue(pending);
    adminRequestRepository.review.mockResolvedValue({ ...pending, status: "APROVADA", reviewedById: admin.id });
    userRepository.updateRole.mockResolvedValue({ ...aluno, role: "ADMIN" });

    await expect(service.review(pending.id, admin.id, { status: "APROVADA" })).resolves.toMatchObject({
      status: "APROVADA",
    });
    expect(userRepository.updateRole).toHaveBeenCalledWith(aluno.id, "ADMIN");
  });
});
