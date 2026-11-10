import { getGemini, GEMINI_MODEL } from "@/lib/gemini";
import { ModelCompletion, ModelMessage, ProviderStep, ToolDefinition } from "@/models/chat.model";
import { IChatRepository } from "./interfaces/chat-repository.interface";

export class ChatRepository implements IChatRepository {
  async complete(messages: ModelMessage[], tools: ToolDefinition[]): Promise<ModelCompletion> {
    const interaction = await getGemini().interactions.create({
      model: GEMINI_MODEL,
      store: false,
      system_instruction: systemInstruction(messages),
      input: toGeminiInput(messages) as never,
      tools: tools.map((tool) => ({
        type: "function" as const,
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
      })),
    });

    const steps = plainSteps(interaction.steps);
    const toolCalls = steps.flatMap((step) => {
      if (step.type !== "function_call" || typeof step.id !== "string" || typeof step.name !== "string") {
        return [];
      }

      return [{ id: step.id, name: step.name, arguments: JSON.stringify(step.arguments ?? {}) }];
    });

    return {
      content: interaction.output_text?.trim() || null,
      toolCalls,
      steps,
    };
  }
}

function systemInstruction(messages: ModelMessage[]): string | undefined {
  const instruction = messages
    .flatMap((message) => (message.role === "system" ? [message.content] : []))
    .join("\n");

  return instruction || undefined;
}

function toGeminiInput(messages: ModelMessage[]) {
  return messages.flatMap((message) => {
    if (message.role === "system") {
      return [];
    }

    if (message.role === "provider") {
      return message.steps;
    }

    if (message.role === "tool") {
      return [
        {
          type: "function_result" as const,
          name: message.name,
          call_id: message.toolCallId,
          result: [{ type: "text" as const, text: message.content }],
        },
      ];
    }

    if (message.role === "assistant") {
      return [{ type: "model_output" as const, content: [{ type: "text" as const, text: message.content }] }];
    }

    return [{ type: "user_input" as const, content: [{ type: "text" as const, text: message.content }] }];
  });
}

function plainSteps(steps: unknown): ProviderStep[] {
  if (!Array.isArray(steps)) {
    return [];
  }

  return JSON.parse(JSON.stringify(steps)) as ProviderStep[];
}
