import { ChatTurn } from "@/models/chat.model";
import { AgentConversationRecord } from "@/models/conversation.model";

export interface IConversationRepository {
  findLatestByUserId(userId: number): Promise<AgentConversationRecord | null>;
  save(userId: number, history: ChatTurn[], conversationId?: string): Promise<AgentConversationRecord>;
}

