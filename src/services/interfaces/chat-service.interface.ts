import { ChatTurn } from "@/models/chat.model";

export interface IChatService {
  reply(messages: ChatTurn[]): Promise<string>;
}
