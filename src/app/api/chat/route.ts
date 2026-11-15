import { NextResponse } from "next/server";
import { validateChatRequest } from "@/app/DTOs/chat.dto";
import { HttpError, toErrorResponse } from "@/lib/http-error";
import { modules } from "@/services/modules";

export async function GET(request: Request) {
  try {
    const user = await modules.services.user.getSessionUser(request.headers);

    if (!user) {
      throw new HttpError("Não autorizado", 401);
    }

    const conversation = await modules.repositories.conversation.findLatestByUserId(user.id);

    return NextResponse.json({
      messages: conversation?.history ?? [],
      conversationId: conversation?.id ?? null,
    });
  } catch (error) {
    return toErrorResponse(error, "Erro ao carregar histórico do assistente");
  }
}

export async function POST(request: Request) {
  try {
    const user = await modules.services.user.getSessionUser(request.headers);

    if (!user) {
      throw new HttpError("Não autorizado", 401);
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      throw new HttpError("Dados inválidos", 400);
    }

    const validation = validateChatRequest(body);

    if (!validation.success) {
      throw new HttpError(validation.error.errors[0]?.message ?? "Dados inválidos", 400);
    }

    const reply = await modules.services.chat.reply(validation.data.messages, {
      id: user.id,
      name: user.name,
    });

    return NextResponse.json({ reply });
  } catch (error) {
    return toErrorResponse(error, "Erro ao consultar o assistente");
  }
}
