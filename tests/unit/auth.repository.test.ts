import { APIError } from "better-auth/api";
import { beforeEach, describe, expect, it, vi } from "vitest";

const api = vi.hoisted(() => ({
  signUpEmail: vi.fn(),
  signInEmail: vi.fn(),
  signOut: vi.fn(),
  getSession: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: { api },
}));

import { AuthRepository } from "@/repositories/auth.repository";

const authUser = { id: "7", name: "Nova", email: "nova@fatec.sp.gov.br", role: null };

describe("AuthRepository", () => {
  const repository = new AuthRepository();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("cadastra e assume o perfil ALUNO quando a conta não traz papel", async () => {
    api.signUpEmail.mockResolvedValue({ user: authUser });
    await expect(
      repository.signUp({ name: "Nova", email: authUser.email, password: "senha1234" })
    ).resolves.toEqual({ id: 7, name: "Nova", email: authUser.email, role: "ALUNO" });
    expect(api.signUpEmail).toHaveBeenCalledWith({
      body: {
        name: "Nova",
        email: authUser.email,
        password: "senha1234",
        callbackURL: "/email-verificado",
      },
    });
  });

  it("preserva um papel informado e traduz erros conhecidos do Better Auth", async () => {
    api.signUpEmail.mockResolvedValueOnce({ user: { ...authUser, role: "ADMIN" } });
    await expect(repository.signUp({ name: "Nova", email: authUser.email, password: "senha1234" })).resolves.toMatchObject({
      role: "ADMIN",
    });

    api.signUpEmail.mockRejectedValueOnce(
      new APIError("UNPROCESSABLE_ENTITY", { message: "exists", code: "USER_ALREADY_EXISTS" })
    );
    await expect(repository.signUp({ name: "Nova", email: authUser.email, password: "senha1234" })).rejects.toMatchObject({
      message: "E-mail já cadastrado",
      status: 422,
    });

    api.signUpEmail.mockRejectedValueOnce(new APIError("BAD_REQUEST", { message: "estranho", code: "OUTRO" }));
    await expect(repository.signUp({ name: "Nova", email: authUser.email, password: "senha1234" })).rejects.toMatchObject({
      message: "estranho",
    });

    api.signUpEmail.mockRejectedValueOnce(new APIError("BAD_REQUEST", { message: "sem codigo" }));
    await expect(repository.signUp({ name: "Nova", email: authUser.email, password: "x" })).rejects.toMatchObject({
      message: "sem codigo",
    });

    api.signUpEmail.mockRejectedValueOnce(new Error("rede"));
    await expect(repository.signUp({ name: "Nova", email: authUser.email, password: "x" })).rejects.toThrow("rede");
  });

  it("devolve o token da sessão ou null quando as credenciais são recusadas", async () => {
    api.signInEmail.mockResolvedValue({ user: { ...authUser, role: "ALUNO" }, token: "sessao" });
    await expect(repository.signIn(authUser.email, "senha1234")).resolves.toEqual({
      id: 7,
      name: "Nova",
      email: authUser.email,
      role: "ALUNO",
      token: "sessao",
    });

    api.signInEmail.mockRejectedValueOnce(new APIError("UNAUTHORIZED", { message: "invalid", code: "INVALID_EMAIL_OR_PASSWORD" }));
    await expect(repository.signIn(authUser.email, "errada")).resolves.toBeNull();

    api.signInEmail.mockRejectedValueOnce(new APIError("INTERNAL_SERVER_ERROR", { message: "falhou", code: "OUTRO" }));
    await expect(repository.signIn(authUser.email, "senha1234")).rejects.toMatchObject({ status: 500, message: "falhou" });
  });

  it("encerra a sessão e lê o usuário corrente", async () => {
    const headers = new Headers({ authorization: "Bearer sessao" });
    api.getSession.mockResolvedValueOnce(null).mockResolvedValueOnce({ user: { ...authUser, role: "ALUNO" } });
    await repository.signOut(headers);
    expect(api.signOut).toHaveBeenCalledWith({ headers });
    await expect(repository.getSessionUser(headers)).resolves.toBeNull();
    await expect(repository.getSessionUser(headers)).resolves.toMatchObject({ role: "ALUNO", id: 7 });
  });
});
