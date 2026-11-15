import { beforeEach, describe, expect, it, vi } from "vitest";
import { RecommenderService } from "@/services/recommender.service";

describe("RecommenderService", () => {
  const service = new RecommenderService("http://localhost:4080", "test-secret-key");

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("retorna recomendação quando o serviço Java responde com sucesso", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          resposta: "Recomendo o curso de Java Básico.",
          conversationId: "conv-123",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    const result = await service.getRecommendation({
      mensagem: "Quero aprender backend",
      nomeUsuario: "Gabriel",
      catalogo: [],
      historico: [],
    });

    expect(result.resposta).toBe("Recomendo o curso de Java Básico.");
    expect(result.conversationId).toBe("conv-123");
  });

  it("envia cabeçalho X-Internal-Key corretamente", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          resposta: "Ok",
          conversationId: "conv-1",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    await service.getRecommendation({
      mensagem: "teste",
      catalogo: [],
      historico: [],
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://localhost:4080/api/agent/recomendar",
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-Internal-Key": "test-secret-key",
        }),
      }),
    );
  });

  it("trata erro HTTP retornado pelo serviço Java", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(
      service.getRecommendation({
        mensagem: "teste",
        catalogo: [],
        historico: [],
      }),
    ).rejects.toMatchObject({
      status: 401,
      message: "Unauthorized",
    });
  });

  it("trata indisponibilidade do serviço Java com erro 503", async () => {
    vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Connection refused"));

    await expect(
      service.getRecommendation({
        mensagem: "teste",
        catalogo: [],
        historico: [],
      }),
    ).rejects.toMatchObject({
      status: 503,
      message: "O serviço de recomendação de cursos está temporariamente indisponível",
    });
  });

  it("isHealthy retorna true quando endpoint health responde 200", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ status: "UP" }), { status: 200 }),
    );

    expect(await service.isHealthy()).toBe(true);
  });

  it("isHealthy retorna false quando endpoint health falha", async () => {
    vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Down"));

    expect(await service.isHealthy()).toBe(false);
  });
});
