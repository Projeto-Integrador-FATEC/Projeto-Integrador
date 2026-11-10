import { RatingService } from "@/services/rating.service";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { aluno, cursoTecnologia } from "../support/fixtures";

const saved = {
  id: 1,
  nota: 8,
  dataAvaliacao: "2026-11-09T00:00:00.000Z",
  user: aluno,
  curso: cursoTecnologia,
};

describe("RatingService", () => {
  const ratingRepository = {
    findByCourseId: vi.fn(),
    averageByCourseId: vi.fn(),
    create: vi.fn(),
  };
  const courseRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    findByCategoryId: vi.fn(),
    create: vi.fn(),
  };
  const userRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    findByEmail: vi.fn(),
  };
  const service = new RatingService(ratingRepository, courseRepository, userRepository);

  beforeEach(() => vi.clearAllMocks());

  it("rejeita nota fora do intervalo de 1 a 10", async () => {
    await expect(service.create({ nota: 0, email: aluno.email, cursoId: 10 })).rejects.toMatchObject({ status: 400 });
    await expect(service.create({ nota: 1.5, email: aluno.email, cursoId: 10 })).rejects.toMatchObject({ status: 400 });
    await expect(service.create({ nota: 11, email: aluno.email, cursoId: 10 })).rejects.toMatchObject({ status: 400 });
  });

  it("exige o e-mail do usuário", async () => {
    await expect(service.create({ nota: 8, email: "", cursoId: 10 })).rejects.toMatchObject({
      status: 400,
      message: "Usuário não informado.",
    });
  });

  it("retorna 404 quando o curso ou o usuário não existe", async () => {
    courseRepository.findById.mockResolvedValue(null);
    await expect(service.create({ nota: 8, email: aluno.email, cursoId: 9999 })).rejects.toMatchObject({
      status: 404,
      message: "Curso não encontrado",
    });

    courseRepository.findById.mockResolvedValue(cursoTecnologia);
    userRepository.findByEmail.mockResolvedValue(null);
    await expect(service.create({ nota: 8, email: "ausente@fatec.sp.gov.br", cursoId: 10 })).rejects.toMatchObject({
      status: 404,
      message: "Usuário não encontrado",
    });
  });

  it("registra a avaliação do curso", async () => {
    courseRepository.findById.mockResolvedValue(cursoTecnologia);
    userRepository.findByEmail.mockResolvedValue(aluno);
    ratingRepository.create.mockResolvedValue(saved);
    await expect(service.create({ nota: 8, email: aluno.email, cursoId: 10 })).resolves.toEqual(saved);
    expect(ratingRepository.create).toHaveBeenCalledWith({ nota: 8, cursoId: 10, userId: aluno.id });
  });

  it("lista avaliações e calcula a média, usando zero quando não há notas", async () => {
    ratingRepository.findByCourseId.mockResolvedValue([saved]);
    ratingRepository.averageByCourseId.mockResolvedValueOnce(8).mockResolvedValueOnce(null);
    await expect(service.getByCourseId(10)).resolves.toEqual([saved]);
    await expect(service.getAverageByCourseId(10)).resolves.toBe(8);
    await expect(service.getAverageByCourseId(10)).resolves.toBe(0);
  });
});
