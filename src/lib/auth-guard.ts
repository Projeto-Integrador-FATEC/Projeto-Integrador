import { modules } from "@/services/modules";
import { HttpError } from "./http-error";

export async function requireRole(request: Request, role: string) {
  const user = await modules.services.user.getSessionUser(request.headers);

  if (!user) {
    throw new HttpError("Não autorizado", 401);
  }

  if (user.role !== role) {
    throw new HttpError("Acesso negado", 403);
  }

  return user;
}
