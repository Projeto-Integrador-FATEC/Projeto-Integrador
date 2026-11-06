import { NextResponse } from "next/server";

export class HttpError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

export function toErrorResponse(error: unknown, fallbackMessage = "Erro interno do servidor") {
  if (error instanceof HttpError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  console.error(error);
  return NextResponse.json({ error: fallbackMessage }, { status: 500 });
}
