import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChatService } from "@/services/chat.service";
import { cursoTecnologia, tecnologia } from "../support/fixtures";

describe("ChatService (Multi-Agent)", () => {
  const chatRepository = { complete: vi.fn() };
  const courseService = {
    getAll: vi.fn(),
    getById: vi.fn(),
    getByCategoryId: vi.fn(),
    search: vi.fn(),
    create: vi.fn(),
  };
  const categoryService = {
    getAll: vi.fn(),
    getById: vi.fn(),
    getCoursesByCategory: vi.fn(),
  };
  const ratingService = {
    getByCourseId: vi.fn(),
    getAverageByCourseId: vi.fn(),
    create: vi.fn(),
  };
  const recommenderService = {
    getRecommendation: vi.fn(),
    isHealthy: vi.fn(),
  };
  const conversationRepository = {
    findLatestByUserId: vi.fn(),
    save: vi.fn(),
  };

  const service = new ChatService(
    chatRepository,
    courseService as never,
    categoryService as never,
    ratingService as never,
    recommenderService,
    conversationRepository,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejeita pergunta vazia ou sem mensagem de usuário", async () => {
    await expect(service.reply([])).rejects.toMatchObject({ status: 400 });
    await expect(service.reply([{ role: "assistant", content: "Olá" }])).rejects.toMatchObject({ status: 400 });
  });

  it("responde diretamente quando o modelo não chama ferramentas", async () => {
    chatRepository.complete.mockResolvedValueOnce({
      content: "Olá! Como posso ajudar?",
      toolCalls: [],
      steps: [],
    });

    const reply = await service.reply([{ role: "user", content: "Olá" }]);
    expect(reply).toBe("Olá! Como posso ajudar?");
  });

  it("persiste histórico no repositório quando context de usuário é fornecido", async () => {
    chatRepository.complete.mockResolvedValueOnce({
      content: "Aqui estão os cursos.",
      toolCalls: [],
      steps: [],
    });

    await service.reply([{ role: "user", content: "Quais cursos existem?" }], {
      id: 42,
      name: "Gabriel",
    });

    expect(conversationRepository.save).toHaveBeenCalledWith(
      42,
      [
        { role: "user", content: "Quais cursos existem?" },
        { role: "assistant", content: "Aqui estão os cursos." },
      ],
      undefined,
    );
  });

  it("encaminha para o agente especialista Java quando a ferramenta recomendarCursos é acionada", async () => {
    courseService.getAll.mockResolvedValueOnce([cursoTecnologia]);
    recommenderService.getRecommendation.mockResolvedValueOnce({
      resposta: "Recomendo o curso de Java para seu objetivo.",
      conversationId: "conv-42",
    });

    // 1st completion: Model calls tool "recomendarCursos"
    chatRepository.complete.mockResolvedValueOnce({
      content: null,
      toolCalls: [
        {
          id: "call-1",
          name: "recomendarCursos",
          arguments: JSON.stringify({ pergunta: "Quero aprender programação do zero" }),
        },
      ],
      steps: [],
    });

    // 2nd completion: Model produces final response after tool execution
    chatRepository.complete.mockResolvedValueOnce({
      content: "O especialista recomendou o curso de Java Básico.",
      toolCalls: [],
      steps: [],
    });

    const reply = await service.reply(
      [{ role: "user", content: "Quero aprender programação do zero" }],
      { id: 10, name: "Aluno" },
    );

    expect(recommenderService.getRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        mensagem: "Quero aprender programação do zero",
        nomeUsuario: "Aluno",
        catalogo: expect.arrayContaining([
          expect.objectContaining({ nome: cursoTecnologia.nome }),
        ]),
      }),
    );
    expect(reply).toBe("O especialista recomendou o curso de Java Básico.");
  });

  it("utiliza fallback gracioso se o serviço especialista de recomendação falhar", async () => {
    courseService.getAll.mockRejectedValueOnce(new Error("Java microservice offline"));
    courseService.search.mockResolvedValueOnce({
      total: 1,
      courses: [cursoTecnologia],
    });

    chatRepository.complete.mockResolvedValueOnce({
      content: null,
      toolCalls: [
        {
          id: "call-1",
          name: "recomendarCursos",
          arguments: JSON.stringify({ pergunta: "Me recomende um curso" }),
        },
      ],
      steps: [],
    });

    chatRepository.complete.mockResolvedValueOnce({
      content: "Não consegui falar com o recomendador, mas encontrei o Curso de Java.",
      toolCalls: [],
      steps: [],
    });

    const reply = await service.reply([{ role: "user", content: "Me recomende um curso" }]);
    expect(reply).toBe("Não consegui falar com o recomendador, mas encontrei o Curso de Java.");
  });
});
