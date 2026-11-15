import { ChatTurn } from "@/models/chat.model";

export interface CoursePayload {
  id: number;
  nome: string;
  descricao: string;
  cargaHoraria: number;
  nivel: string;
  provider: string;
  url: string;
  categoria: string | null;
}

export interface RecommendationRequest {
  mensagem: string;
  nomeUsuario?: string;
  userId?: number;
  conversationId?: string;
  catalogo: CoursePayload[];
  historico: ChatTurn[];
}

export interface RecommendationResult {
  resposta: string;
  conversationId?: string;
}

export interface IRecommenderService {
  getRecommendation(request: RecommendationRequest): Promise<RecommendationResult>;
  isHealthy(): Promise<boolean>;
}

