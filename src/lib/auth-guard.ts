import { auth } from "../../auth";
import { modules } from "@/services/modules";
import { HttpError } from "./http-error";

async function resolveRole(request: Request): Promise<string | null> {
  const authorization = request.headers.get("authorization");

  if (authorization?.startsWith("Bearer ")) {
    try {
      return await modules.services.token.extractRole(authorization.slice(7));
    } catch {
      throw new HttpError("Token inválido", 401);
    }
  }

  const session = await auth();
  return session?.user?.role ?? null;
}

export async function requireRole(request: Request, role: string) {
  const currentRole = await resolveRole(request);

  if (!currentRole) {
    throw new HttpError("Não autorizado", 401);
  }

  if (currentRole !== role) {
    throw new HttpError("Acesso negado", 403);
  }
}
