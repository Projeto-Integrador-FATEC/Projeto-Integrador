export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface ModelTextMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ProviderStep {
  type: string;
  [key: string]: unknown;
}

export interface ModelProviderMessage {
  role: "provider";
  steps: ProviderStep[];
}

export interface ModelToolResultMessage {
  role: "tool";
  content: string;
  toolCallId: string;
  name: string;
}

export type ModelMessage = ModelTextMessage | ModelProviderMessage | ModelToolResultMessage;

export interface ModelCompletion {
  content: string | null;
  toolCalls: ToolCall[];
  steps: ProviderStep[];
}
