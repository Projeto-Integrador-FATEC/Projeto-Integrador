import { APIError } from "better-auth/api";
import { auth } from "@/lib/auth";
import { HttpError } from "@/lib/http-error";
import { CreateUserData, LoginResult, User } from "@/models/user.model";
import { IAuthRepository } from "./interfaces/auth-repository.interface";

const ERROR_MESSAGES: Record<string, string> = {
  USER_ALREADY_EXISTS: "E-mail já cadastrado",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "E-mail já cadastrado",
  INVALID_EMAIL: "E-mail inválido",
  PASSWORD_TOO_SHORT: "A senha deve ter pelo menos 8 caracteres",
  PASSWORD_TOO_LONG: "A senha é muito longa",
  INVALID_EMAIL_OR_PASSWORD: "Credenciais inválidas",
};

const EMAIL_VERIFIED_CALLBACK_URL = "/email-verificado";

type AuthUser = { id: string | number; name: string; email: string; role?: string | null };

function toUser(user: AuthUser): User {
  return {
    id: Number(user.id),
    name: user.name,
    email: user.email,
    role: user.role ?? "ALUNO",
  };
}

function toHttpError(error: unknown): unknown {
  if (!(error instanceof APIError)) {
    return error;
  }

  const code = typeof error.body?.code === "string" ? error.body.code : "";
  return new HttpError(ERROR_MESSAGES[code] ?? error.message, error.statusCode);
}

export class AuthRepository implements IAuthRepository {
  async signUp(data: CreateUserData): Promise<User> {
    try {
      const result = await auth.api.signUpEmail({
        body: { ...data, callbackURL: EMAIL_VERIFIED_CALLBACK_URL },
      });
      return toUser(result.user);
    } catch (error) {
      throw toHttpError(error);
    }
  }

  async signIn(email: string, password: string): Promise<LoginResult | null> {
    try {
      const result = await auth.api.signInEmail({ body: { email, password } });
      return { ...toUser(result.user), token: result.token };
    } catch (error) {
      if (error instanceof APIError && error.statusCode === 401) {
        return null;
      }

      throw toHttpError(error);
    }
  }

  async signOut(headers: Headers): Promise<void> {
    await auth.api.signOut({ headers });
  }

  async getSessionUser(headers: Headers): Promise<User | null> {
    const session = await auth.api.getSession({ headers });
    return session ? toUser(session.user) : null;
  }
}
