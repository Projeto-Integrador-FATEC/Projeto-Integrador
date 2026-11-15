import { ChatTurn } from "@/models/chat.model";

export interface ChatUserContext {
  id?: number;
  name?: string;
  conversationId?: string;
}

export interface IChatService {
  reply(messages: ChatTurn[], context?: ChatUserContext): Promise<string>;
}
