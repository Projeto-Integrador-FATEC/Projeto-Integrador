import { prisma } from "@/lib/prisma";
import { ChatTurn } from "@/models/chat.model";
import { AgentConversationRecord } from "@/models/conversation.model";
import { IConversationRepository } from "./interfaces/conversation-repository.interface";

export class ConversationRepository implements IConversationRepository {
  async findLatestByUserId(userId: number): Promise<AgentConversationRecord | null> {
    const row = await prisma.agentConversation.findFirst({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      userId: row.userId,
      history: parseHistory(row.historyJson),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  async save(userId: number, history: ChatTurn[], conversationId?: string): Promise<AgentConversationRecord> {
    const historyJson = JSON.stringify(history.slice(-20));

    if (conversationId) {
      const existing = await prisma.agentConversation.findUnique({
        where: { id: conversationId },
      });

      if (existing) {
        const updated = await prisma.agentConversation.update({
          where: { id: conversationId },
          data: { historyJson },
        });

        return {
          id: updated.id,
          userId: updated.userId,
          history: parseHistory(updated.historyJson),
          createdAt: updated.createdAt,
          updatedAt: updated.updatedAt,
        };
      }
    }

    const created = await prisma.agentConversation.create({
      data: {
        userId,
        historyJson,
        ...(conversationId ? { id: conversationId } : {}),
      },
    });

    return {
      id: created.id,
      userId: created.userId,
      history: parseHistory(created.historyJson),
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }
}

function parseHistory(json: string): ChatTurn[] {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? (parsed as ChatTurn[]) : [];
  } catch {
    return [];
  }
}

