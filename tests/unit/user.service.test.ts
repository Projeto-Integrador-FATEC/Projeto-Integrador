import { HttpError } from "@/lib/http-error";
import { UserService } from "@/services/user.service";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { aluno } from "../support/fixtures";

describe("UserService", () => {
  const userRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    findByEmail: vi.fn(),
  };
  const authRepository = {
    signUp: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    getSessionUser: vi.fn(),
  };
  const service = new UserService(userRepository, authRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lista os usuários", async () => {
    userRepository.findAll.mockResolvedValue([aluno]);
    await expect(service.getAll()).resolves.toEqual([aluno]);
  });

  it("busca usuário por id", async () => {
    userRepository.findById.mockResolvedValue(aluno);
    await expect(service.getById(1)).resolves.toEqual(aluno);
  });

  it("retorna 404 quando o id não existe", async () => {
    userRepository.findById.mockResolvedValue(null);
    await expect(service.getById(99)).rejects.toMatchObject({ message: "Usuário não encontrado", status: 404 });
  });

  it("busca usuário por e-mail", async () => {
    userRepository.findByEmail.mockResolvedValue(aluno);
    await expect(service.getByEmail(aluno.email)).resolves.toEqual(aluno);
  });

  it("retorna 404 quando o e-mail não existe", async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    await expect(service.getByEmail("ausente@fatec.sp.gov.br")).rejects.toBeInstanceOf(HttpError);
  });

  it("rejeita cadastro com campos vazios", async () => {
    await expect(service.create({ name: "", email: aluno.email, password: "senha1234" })).rejects.toMatchObject({
      status: 400,
    });
    expect(authRepository.signUp).not.toHaveBeenCalled();
  });

  it("cadastra o estudante pelo repositório de autenticação", async () => {
    authRepository.signUp.mockResolvedValue(aluno);
    const data = { name: aluno.name, email: aluno.email, password: "senha1234" };
    await expect(service.create(data)).resolves.toEqual(aluno);
    expect(authRepository.signUp).toHaveBeenCalledWith(data);
  });

  it("exige e-mail e senha no login", async () => {
    await expect(service.login("", "senha1234")).rejects.toMatchObject({ status: 400 });
  });

  it("autentica e devolve o resultado da sessão", async () => {
    const session = { ...aluno, token: "token-1" };
    authRepository.signIn.mockResolvedValue(session);
    await expect(service.login(aluno.email, "senha1234")).resolves.toEqual(session);
  });

  it("encerra a sessão e lê o usuário autenticado", async () => {
    const headers = new Headers();
    authRepository.getSessionUser.mockResolvedValue(aluno);
    await service.logout(headers);
    await expect(service.getSessionUser(headers)).resolves.toEqual(aluno);
    expect(authRepository.signOut).toHaveBeenCalledWith(headers);
  });
});
