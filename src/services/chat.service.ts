import { z } from "zod";
import { HttpError } from "@/lib/http-error";
import { ChatTurn, ModelMessage, ToolCall, ToolDefinition } from "@/models/chat.model";
import { Course } from "@/models/course.model";
import { IChatRepository } from "@/repositories/interfaces/chat-repository.interface";
import { IConversationRepository } from "@/repositories/interfaces/conversation-repository.interface";
import { ICategoryService } from "./interfaces/category-service.interface";
import { ChatUserContext, IChatService } from "./interfaces/chat-service.interface";
import { ICourseService } from "./interfaces/course-service.interface";
import { IRatingService } from "./interfaces/rating-service.interface";
import { IRecommenderService } from "./interfaces/recommender-service.interface";

const MAX_TOOL_ROUNDS = 4;
const OUT_OF_SCOPE_REPLY =
  "Como assistente, estou aqui para ajudar com cursos cadastrados na Study Lovers. " +
  "Se estiver buscando cursos para iniciar seus estudos ou desenvolver novas habilidades, " +
  "estou à disposição para ajudar com informações e recomendações do nosso catálogo!";

const COURSE_SCOPE_TERMS = /\b(cursos?|curso|catalogo|estud\w*|aprend\w*|aulas?|trilhas?|formacao|treinamento|capacitacao|certificacao|carreir\w*|habilidad\w*|profiss\w*|programacao|programar|desenvolvimento|design|idiomas?|ingles|marketing|tecnologia|dados|gestao|negocios|esse curso|essa formacao|carga horaria|nivel do curso|link do curso)\b/i;

const SYSTEM_PROMPT = [
  "Você é o assistente principal da Study Lovers, uma plataforma de cursos gratuitos.",
  "Responda em português, de forma curta e direta.",
  "Antes de afirmar que um curso existe, quantos existem, qual é o conteúdo ou como ele foi avaliado, chame uma ferramenta.",
  "O campo total de buscarCursos é a quantidade que combina com o filtro. A lista pode vir incompleta por causa do limite.",
  "Use verAvaliacoes para média, quantidade de notas e as notas de um curso. A escala é de 1 a 10. Se total for 0, diga que o curso ainda não foi avaliado.",
  "Se a busca não encontrar nada, diga que não há curso correspondente.",
  "Ao citar um curso, inclua o caminho do campo pagina para a pessoa abrir os detalhes.",
  "Não invente cursos, cargas horárias, níveis, categorias, notas, médias ou links.",
  "Quando o usuário solicitar recomendações personalizadas de cursos, conselhos sobre o que estudar, orientação de carreira ou comparação sobre qual curso fazer, chame a ferramenta recomendarCursos para consultar o agente especialista em recomendação.",
].join(" ");

const TOOLS: ToolDefinition[] = [
  {
    name: "buscarCursos",
    description:
      "Busca cursos cadastrados por assunto, nível ou categoria. Use para listar, contar ou encontrar cursos. total é a quantidade encontrada; cursos traz no máximo o limite.",
    parameters: {
      type: "object",
      properties: {
        termo: {
          type: "string",
          description: "Palavra do nome, da descrição ou de quem oferece o curso. Omita para não filtrar por texto.",
        },
        nivel: {
          type: "string",
          enum: ["iniciante", "intermediario", "avancado"],
          description: "Nível do curso. Omita para qualquer nível.",
        },
        categoria: {
          type: "string",
          description: "Nome da categoria, como Tecnologia ou Design. Omita para qualquer categoria.",
        },
        limite: {
          type: "integer",
          description: "Quantidade máxima de cursos na lista, de 1 a 10. Omita para usar 10.",
        },
      },
    },
  },
  {
    name: "verCurso",
    description: "Retorna um curso pelo id, com descrição, carga horária, nível, quem oferece e a página interna.",
    parameters: {
      type: "object",
      properties: {
        id: { type: "integer", description: "Id do curso retornado por buscarCursos." },
      },
      required: ["id"],
    },
  },
  {
    name: "listarCategorias",
    description: "Lista as categorias de cursos cadastradas.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "verAvaliacoes",
    description:
      "Consulta a média, a quantidade de avaliações e as notas de um curso. Use para perguntas sobre qualidade, nota, melhor curso ou se vale a pena. A escala é de 1 a 10.",
    parameters: {
      type: "object",
      properties: {
        id: { type: "integer", description: "Id do curso retornado por buscarCursos ou verCurso." },
      },
      required: ["id"],
    },
  },
  {
    name: "recomendarCursos",
    description:
      "Consulta o agente especialista em recomendação personalizada de cursos do catálogo Study Lovers. Use para pedidos onde o usuário busca sugestões sob medida, trilhas de aprendizagem, recomendações para seus objetivos ou interesses de estudo.",
    parameters: {
      type: "object",
      properties: {
        pergunta: {
          type: "string",
          description: "O pedido, interesse ou objetivo de aprendizado do usuário para a recomendação.",
        },
      },
      required: ["pergunta"],
    },
  },
];

const searchArgsSchema = z.object({
  termo: z.string().max(100).nullable().optional(),
  nivel: z.string().max(40).nullable().optional(),
  categoria: z.string().max(80).nullable().optional(),
  limite: z.number().int().min(1).max(10).nullable().optional(),
});

const courseArgsSchema = z.object({
  id: z.number().int().positive(),
});

const recommendationArgsSchema = z.object({
  pergunta: z.string().max(2000).nullable().optional(),
});

export class ChatService implements IChatService {
  constructor(
    private readonly chatRepository: IChatRepository,
    private readonly courseService: ICourseService,
    private readonly categoryService: ICategoryService,
    private readonly ratingService: IRatingService,
    private readonly recommenderService?: IRecommenderService,
    private readonly conversationRepository?: IConversationRepository,
  ) {}

  async reply(messages: ChatTurn[], context?: ChatUserContext): Promise<string> {
    const lastMessage = messages.at(-1);

    if (!lastMessage || lastMessage.role !== "user" || messages.length > 20) {
      throw new HttpError("Envie uma pergunta sobre os cursos", 400);
    }

    if (!isCourseRelated(lastMessage.content, messages.slice(0, -1))) {
      if (this.conversationRepository && context?.id) {
        try {
          const refusalMessages: ChatTurn[] = [
            ...messages,
            { role: "assistant", content: OUT_OF_SCOPE_REPLY },
          ];
          await this.conversationRepository.save(
            context.id,
            refusalMessages,
            context.conversationId,
          );
        } catch {
          // A falha ao persistir o histórico não impede a resposta.
        }
      }

      return OUT_OF_SCOPE_REPLY;
    }

    const history: ModelMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((message) => ({ role: message.role, content: message.content })),
    ];

    for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
      const completion = await this.complete(history);

      if (completion.toolCalls.length === 0) {
        const reply = completion.content?.trim();

        if (!reply) {
          throw new HttpError("O assistente não retornou uma resposta", 502);
        }

        if (this.conversationRepository && context?.id) {
          try {
            await this.conversationRepository.save(
              context.id,
              [...messages, { role: "assistant", content: reply }],
              context.conversationId,
            );
          } catch {
            // Falha não impeditiva de persistência do histórico
          }
        }

        return reply;
      }

      history.push({ role: "provider", steps: completion.steps });

      for (const call of completion.toolCalls) {
        history.push({
          role: "tool",
          name: call.name,
          toolCallId: call.id,
          content: await this.runTool(call, messages, context),
        });
      }
    }

    throw new HttpError("Não foi possível concluir a resposta sobre os cursos", 502);
  }

  private async complete(messages: ModelMessage[]) {
    try {
      return await this.chatRepository.complete(messages, TOOLS);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }

      if (error instanceof Error && error.message === "GEMINI_API_KEY ausente") {
        throw new HttpError("O assistente de cursos não está configurado", 503);
      }

      throw new HttpError("Não foi possível consultar o assistente de cursos", 502);
    }
  }

  private async runTool(call: ToolCall, messages: ChatTurn[], context?: ChatUserContext): Promise<string> {
    try {
      const args = parseArguments(call.arguments);

      switch (call.name) {
        case "buscarCursos":
          return JSON.stringify(await this.searchCourses(args));
        case "verCurso":
          return JSON.stringify(await this.readCourse(args));
        case "listarCategorias":
          return JSON.stringify(await this.listCategories());
        case "verAvaliacoes":
          return JSON.stringify(await this.readRatings(args));
        case "recomendarCursos":
          return JSON.stringify(await this.getRecommendation(args, messages, context));
        default:
          return JSON.stringify({ erro: "Ferramenta desconhecida" });
      }
    } catch (error) {
      if (error instanceof HttpError || error instanceof z.ZodError) {
        const message = error instanceof HttpError ? error.message : "Argumentos inválidos";
        return JSON.stringify({ erro: message });
      }

      throw error;
    }
  }

  private async searchCourses(args: unknown) {
    const parsed = searchArgsSchema.parse(args);
    const result = await this.courseService.search({
      termo: parsed.termo ?? undefined,
      nivel: parsed.nivel ?? undefined,
      categoria: parsed.categoria ?? undefined,
      limite: parsed.limite ?? undefined,
    });

    return {
      total: result.total,
      cursos: result.courses.map(presentCourse),
    };
  }

  private async readCourse(args: unknown) {
    const parsed = courseArgsSchema.parse(args);
    return presentCourse(await this.courseService.getById(parsed.id));
  }

  private async listCategories() {
    const categories = await this.categoryService.getAll();
    return categories.map((category) => ({ id: category.id, nome: category.nome }));
  }

  private async readRatings(args: unknown) {
    const parsed = courseArgsSchema.parse(args);
    const course = await this.courseService.getById(parsed.id);
    const [media, ratings] = await Promise.all([
      this.ratingService.getAverageByCourseId(course.id),
      this.ratingService.getByCourseId(course.id),
    ]);

    return {
      id: course.id,
      nome: course.nome,
      pagina: `/curso-details/${course.id}`,
      escala: "1 a 10",
      media: ratings.length > 0 ? Number(media.toFixed(1)) : null,
      total: ratings.length,
      notas: ratings.map((rating) => rating.nota),
    };
  }

  private async getRecommendation(args: unknown, messages: ChatTurn[], context?: ChatUserContext) {
    const parsed = recommendationArgsSchema.parse(args);
    const question = parsed.pergunta || messages.at(-1)?.content || "";

    if (!this.recommenderService) {
      const fallbackSearch = await this.courseService.search({
        termo: question.slice(0, 50),
        limite: 3,
      });
      return {
        aviso: "Especialista em recomendações não configurado. Seguem cursos encontrados no catálogo:",
        cursos: fallbackSearch.courses.map(presentCourse),
      };
    }

    try {
      const allCourses = await this.courseService.getAll();
      const catalogo = allCourses.map((c) => ({
        id: c.id,
        nome: c.nome,
        descricao: c.descricao,
        cargaHoraria: c.cargaHoraria,
        nivel: c.nivel,
        provider: c.provider,
        url: c.url,
        categoria: c.categoria?.nome ?? null,
      }));

      const result = await this.recommenderService.getRecommendation({
        mensagem: question,
        nomeUsuario: context?.name ?? "Aluno",
        userId: context?.id,
        conversationId: context?.conversationId,
        catalogo,
        historico: messages.slice(0, -1),
      });

      return {
        recomendacaoEspecialista: result.resposta,
        origem: "agente_recomendador_java",
      };
    } catch {
      const fallbackSearch = await this.courseService.search({
        termo: question.slice(0, 50),
        limite: 3,
      });

      return {
        aviso: "O especialista em recomendações está temporariamente inacessível. Apresente estas opções do catálogo com base na pesquisa:",
        cursos: fallbackSearch.courses.map(presentCourse),
      };
    }
  }
}

function isCourseRelated(question: string, history: ChatTurn[]): boolean {
  const normalizedQuestion = normalizeScopeText(question);

  if (COURSE_SCOPE_TERMS.test(normalizedQuestion)) {
    return true;
  }

  const isShortFollowUp = normalizedQuestion.trim().length <= 100 &&
    /\b(esse|essa|isso|ele|ela|deles|delas|qual|quanto|mais|menos|preco|valor|link|nivel|horas)\b/i.test(normalizedQuestion);

  return isShortFollowUp && history.some((message) =>
    message.role === "assistant" && COURSE_SCOPE_TERMS.test(normalizeScopeText(message.content)),
  );
}

function normalizeScopeText(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function parseArguments(value: string): unknown {
  try {
    return value.trim() ? JSON.parse(value) : {};
  } catch {
    throw new HttpError("Argumentos inválidos", 400);
  }
}

function presentCourse(course: Course) {
  return {
    id: course.id,
    nome: course.nome,
    descricao: course.descricao,
    cargaHoraria: course.cargaHoraria,
    nivel: course.nivel,
    provider: course.provider,
    url: course.url,
    categoria: course.categoria?.nome ?? null,
    pagina: `/curso-details/${course.id}`,
  };
}
