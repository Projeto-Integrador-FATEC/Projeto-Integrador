import { HttpError } from "@/lib/http-error";
import {
  IRecommenderService,
  RecommendationRequest,
  RecommendationResult,
} from "./interfaces/recommender-service.interface";

export class RecommenderService implements IRecommenderService {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly timeoutMs: number;

  constructor(baseUrl?: string, apiKey?: string, timeoutMs = 15000) {
    this.baseUrl = (baseUrl || process.env.RECOMMENDER_API_URL || "http://localhost:4080").replace(/\/+$/, "");
    this.apiKey = apiKey || process.env.RECOMMENDER_API_KEY || process.env.INTERNAL_API_KEY || "studylovers-internal-secret-key";
    this.timeoutMs = timeoutMs;
  }

  async isHealthy(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/agent/health`, {
        method: "GET",
        signal: AbortSignal.timeout(2000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async getRecommendation(request: RecommendationRequest): Promise<RecommendationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/agent/recomendar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Internal-Key": this.apiKey,
        },
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(this.timeoutMs),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message = data?.error || data?.erro || "Falha ao obter recomendação do especialista";
        throw new HttpError(message, response.status >= 500 ? 502 : response.status);
      }

      if (!data?.resposta || typeof data.resposta !== "string") {
        throw new HttpError("O especialista de cursos não retornou uma recomendação válida", 502);
      }

      return {
        resposta: data.resposta,
        conversationId: data.conversationId,
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      if (error instanceof Error && error.name === "TimeoutError") {
        throw new HttpError("O especialista de recomendações demorou para responder", 504);
      }
      throw new HttpError("O serviço de recomendação de cursos está temporariamente indisponível", 503);
    }
  }
}

