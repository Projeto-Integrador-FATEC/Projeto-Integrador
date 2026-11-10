import { ModelCompletion, ModelMessage, ToolDefinition } from "@/models/chat.model";

export interface IChatRepository {
  complete(messages: ModelMessage[], tools: ToolDefinition[]): Promise<ModelCompletion>;
}
