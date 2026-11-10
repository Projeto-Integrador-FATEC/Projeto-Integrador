import { CommentService } from "@/services/comment.service";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { aluno, cursoTecnologia } from "../support/fixtures";

const saved = {
  id: 1,
  texto: "Conteúdo muito claro",
  date: "2026-11-09T00:00:00.000Z",
  user: aluno,
  curso: cursoTecnologia,
};

describe("CommentService", () => {
  const commentRepository = {
    findById: vi.fn(),
    findByCourseId: vi.fn(),
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
  const service = new CommentService(commentRepository, courseRepository, userRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("busca comentário por id", async () => {
    commentRepository.findById.mockResolvedValue(saved);
    await expect(service.getById(1)).resolves.toEqual(saved);
  });

  it("retorna 404 quando o comentário não existe", async () => {
    commentRepository.findById.mockResolvedValue(null);
    await expect(service.getById(9)).rejects.toMatchObject({ status: 404, message: "Comentário não encontrado" });
  });

  it("lista comentários do curso", async () => {
    commentRepository.findByCourseId.mockResolvedValue([saved]);
    await expect(service.getByCourseId(10)).resolves.toEqual([saved]);
  });

  it("exige usuário, curso e texto", async () => {
    await expect(service.create({ texto: "ok", cursoId: 10, emailUsuario: "" })).rejects.toMatchObject({ status: 400 });
    await expect(service.create({ texto: "ok", cursoId: 0, emailUsuario: aluno.email })).rejects.toMatchObject({ status: 400 });
    await expect(service.create({ texto: "   ", cursoId: 10, emailUsuario: aluno.email })).rejects.toMatchObject({ status: 400 });
    expect(commentRepository.create).not.toHaveBeenCalled();
  });

  it("retorna 404 quando o curso não existe", async () => {
    courseRepository.findById.mockResolvedValue(null);
    await expect(
      service.create({ texto: "Comentário", cursoId: 9999, emailUsuario: aluno.email })
    ).rejects.toMatchObject({ status: 404, message: "Curso não encontrado" });
    expect(commentRepository.create).not.toHaveBeenCalled();
  });

  it("retorna 404 quando o usuário não existe", async () => {
    courseRepository.findById.mockResolvedValue(cursoTecnologia);
    userRepository.findByEmail.mockResolvedValue(null);
    await expect(
      service.create({ texto: "Comentário", cursoId: 10, emailUsuario: "ausente@fatec.sp.gov.br" })
    ).rejects.toMatchObject({ status: 404, message: "Usuário não encontrado" });
  });

  it("grava o comentário vinculado ao curso e ao usuário", async () => {
    courseRepository.findById.mockResolvedValue(cursoTecnologia);
    userRepository.findByEmail.mockResolvedValue(aluno);
    commentRepository.create.mockResolvedValue(saved);

    await expect(
      service.create({ texto: "Conteúdo muito claro", cursoId: 10, emailUsuario: aluno.email })
    ).resolves.toEqual(saved);

    expect(commentRepository.create).toHaveBeenCalledWith({
      texto: "Conteúdo muito claro",
      cursoId: 10,
      userId: aluno.id,
    });
  });
});
