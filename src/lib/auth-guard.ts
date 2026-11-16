import { modules } from "@/services/modules";
import { HttpError } from "./http-error";

export async function requireUser(request: Request) {
  const user = await modules.services.user.getSessionUser(request.headers);

  if (!user) {
    throw new HttpError("Não autorizado", 401);
  }

  return user;
}

export async function requireRole(request: Request, role: string) {
  const user = await requireUser(request);

  if (user.role !== role) {
    throw new HttpError("Acesso negado", 403);
  }

  return user;
}

export async function requireSeedAdmin(request: Request) {
  const user = await requireRole(request, "ADMIN");

  if (!user.seedAdmin) {
    throw new HttpError("Apenas os administradores iniciais podem analisar chamados", 403);
  }

  return user;
}
