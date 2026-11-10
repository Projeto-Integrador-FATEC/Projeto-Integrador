import { z } from "zod";
import { HttpError } from "@/lib/http-error";
import { ChatTurn, ModelMessage, ToolCall, ToolDefinition } from "@/models/chat.model";
import { Course } from "@/models/course.model";
import { IChatRepository } from "@/repositories/interfaces/chat-repository.interface";
import { ICategoryService } from "./interfaces/category-service.interface";
import { IChatService } from "./interfaces/chat-service.interface";
import { ICourseService } from "./interfaces/course-service.interface";

const MAX_TOOL_ROUNDS = 4;

const SYSTEM_PROMPT = [
  "Você é o assistente da Study Lovers, uma plataforma de cursos gratuitos.",
  "Responda em português, de forma curta e direta.",
  "Antes de afirmar que um curso existe, quantos existem ou qual é o conteúdo, chame uma ferramenta.",
  "O campo total de buscarCursos é a quantidade que combina com o filtro. A lista pode vir incompleta por causa do limite.",
  "Se a busca não encontrar nada, diga que não há curso correspondente.",
  "Ao citar um curso, inclua o caminho do campo pagina para a pessoa abrir os detalhes.",
  "Não invente cursos, cargas horárias, níveis, categorias ou links.",
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

export class ChatService implements IChatService {
  constructor(
    private readonly chatRepository: IChatRepository,
    private readonly courseService: ICourseService,
    private readonly categoryService: ICategoryService,
  ) {}

  async reply(messages: ChatTurn[]): Promise<string> {
    const lastMessage = messages.at(-1);

    if (!lastMessage || lastMessage.role !== "user" || messages.length > 20) {
      throw new HttpError("Envie uma pergunta sobre os cursos", 400);
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

        return reply;
      }

      history.push({ role: "provider", steps: completion.steps });

      for (const call of completion.toolCalls) {
        history.push({
          role: "tool",
          name: call.name,
          toolCallId: call.id,
          content: await this.runTool(call),
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

  private async runTool(call: ToolCall): Promise<string> {
    try {
      const args = parseArguments(call.arguments);

      switch (call.name) {
        case "buscarCursos":
          return JSON.stringify(await this.searchCourses(args));
        case "verCurso":
          return JSON.stringify(await this.readCourse(args));
        case "listarCategorias":
          return JSON.stringify(await this.listCategories());
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
