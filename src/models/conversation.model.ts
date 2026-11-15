import { ChatTurn } from "./chat.model";

export interface AgentConversationRecord {
  id: string;
  userId: number;
  history: ChatTurn[];
  createdAt: Date;
  updatedAt: Date;
}

