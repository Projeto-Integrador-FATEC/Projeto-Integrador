import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createTestApp, TestApp } from "../support/app";
import { aluno, cursoTecnologia } from "../support/fixtures";
import { jsonRequest } from "../support/http";
import { GET as getChatHistory, POST as postChatMessage } from "@/app/api/chat/route";

const doubles = vi.hoisted(() => ({
  app: null as TestApp | null,
}));

vi.mock("@/services/modules", () => ({
  get modules() {
    return {
      get services() {
        return doubles.app!.services;
      },
      get repositories() {
        return doubles.app!.repositories;
      },
    };
  },
}));

describe("Integração do Chatbot Multiagente (Next.js + Java Recommender)", () => {
  beforeEach(() => {
    doubles.app = createTestApp();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("exige autenticação nas rotas GET e POST do chat", async () => {
    const unauthenticatedGet = await getChatHistory(new Request("http://localhost/api/chat"));
    expect(unauthenticatedGet.status).toBe(401);

    const unauthenticatedPost = await postChatMessage(
      jsonRequest("http://localhost/api/chat", {
        messages: [{ role: "user", content: "Olá" }],
      }),
    );
    expect(unauthenticatedPost.status).toBe(401);
  });

  it("valida payload da mensagem (rejeita lista vazia)", async () => {
    const response = await postChatMessage(
      jsonRequest(
        "http://localhost/api/chat",
        { messages: [] },
        { headers: { authorization: "Bearer aluno" } },
      ),
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain("Envie uma mensagem");
  });

  it("chatbot principal responde isoladamente quando não há necessidade de recomendação", async () => {
    vi.spyOn(doubles.app!.chatRepository, "complete").mockResolvedValueOnce({
      content: "Temos 1 curso de programação cadastrado.",
      toolCalls: [],
      steps: [],
    });

    const response = await postChatMessage(
      jsonRequest(
        "http://localhost/api/chat",
        {
          messages: [{ role: "user", content: "Quantos cursos de programação vocês têm?" }],
        },
        { headers: { authorization: "Bearer aluno" } },
      ),
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.reply).toBe("Temos 1 curso de programação cadastrado.");
  });

  it("encaminha a solicitação ao agente especialista Java quando a recomendação é solicitada", async () => {
    const recommenderSpy = vi
      .spyOn(doubles.app!.recommenderService, "getRecommendation")
      .mockResolvedValueOnce({
        resposta: "Com base no catálogo Study Lovers, recomendo o Curso de Java Básico.",
        conversationId: "conv-101",
      });

    vi.spyOn(doubles.app!.chatRepository, "complete")
      .mockResolvedValueOnce({
        content: null,
        toolCalls: [
          {
            id: "call-rec-1",
            name: "recomendarCursos",
            arguments: JSON.stringify({ pergunta: "Quero uma recomendação para começar a programar" }),
          },
        ],
        steps: [],
      })
      .mockResolvedValueOnce({
        content: "O especialista recomendou: Com base no catálogo Study Lovers, recomendo o Curso de Java Básico.",
        toolCalls: [],
        steps: [],
      });

    const response = await postChatMessage(
      jsonRequest(
        "http://localhost/api/chat",
        {
          messages: [{ role: "user", content: "Quero uma recomendação para começar a programar" }],
        },
        { headers: { authorization: "Bearer aluno" } },
      ),
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.reply).toContain("Com base no catálogo Study Lovers, recomendo o Curso de Java Básico.");

    // Verifica que o contrato foi respeitado na chamada ao agente Java
    expect(recommenderSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        mensagem: "Quero uma recomendação para começar a programar",
        nomeUsuario: aluno.name,
        userId: aluno.id,
        catalogo: expect.arrayContaining([
          expect.objectContaining({ nome: cursoTecnologia.nome }),
        ]),
      }),
    );
  });

  it("persiste histórico da conversa e permite recuperação via GET /api/chat", async () => {
    vi.spyOn(doubles.app!.chatRepository, "complete").mockResolvedValueOnce({
      content: "Java é uma linguagem orientada a objetos.",
      toolCalls: [],
      steps: [],
    });

    const postResponse = await postChatMessage(
      jsonRequest(
        "http://localhost/api/chat",
        {
          messages: [{ role: "user", content: "O que é Java?" }],
        },
        { headers: { authorization: "Bearer aluno" } },
      ),
    );
    expect(postResponse.status).toBe(200);

    // Consulta histórico persistido
    const getResponse = await getChatHistory(
      new Request("http://localhost/api/chat", {
        headers: { authorization: "Bearer aluno" },
      }),
    );

    expect(getResponse.status).toBe(200);
    const historyData = await getResponse.json();
    expect(historyData.messages).toHaveLength(2);
    expect(historyData.messages[0]).toEqual({ role: "user", content: "O que é Java?" });
    expect(historyData.messages[1]).toEqual({ role: "assistant", content: "Java é uma linguagem orientada a objetos." });
  });

  it("fornece fallback resiliente quando o microsserviço Java está inacessível", async () => {
    vi.spyOn(doubles.app!.recommenderService, "getRecommendation").mockRejectedValueOnce(
      new Error("503 Service Unavailable"),
    );

    vi.spyOn(doubles.app!.chatRepository, "complete")
      .mockResolvedValueOnce({
        content: null,
        toolCalls: [
          {
            id: "call-rec-2",
            name: "recomendarCursos",
            arguments: JSON.stringify({ pergunta: "Qual o melhor curso?" }),
          },
        ],
        steps: [],
      })
      .mockResolvedValueOnce({
        content: "O recomendador está fora do ar, mas encontrei o Curso de Java Básico no catálogo.",
        toolCalls: [],
        steps: [],
      });

    const response = await postChatMessage(
      jsonRequest(
        "http://localhost/api/chat",
        {
          messages: [{ role: "user", content: "Qual o melhor curso?" }],
        },
        { headers: { authorization: "Bearer aluno" } },
      ),
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.reply).toContain("Curso de Java Básico");
  });
});

