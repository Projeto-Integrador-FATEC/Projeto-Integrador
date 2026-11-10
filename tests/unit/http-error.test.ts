import { HttpError, toErrorResponse } from "@/lib/http-error";
import { describe, expect, it, vi } from "vitest";

describe("toErrorResponse", () => {
  it("preserva status e mensagem do HttpError", async () => {
    const response = toErrorResponse(new HttpError("Curso não encontrado", 404));
    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: "Curso não encontrado" });
  });

  it("responde 500 para erros inesperados", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const response = toErrorResponse(new Error("falha"), "Erro ao buscar cursos");
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "Erro ao buscar cursos" });
    errorSpy.mockRestore();
  });
});
