import { CreateUserData, LoginResult, User } from "@/models/user.model";

export interface IAuthRepository {
  signUp(data: CreateUserData): Promise<User>;
  signIn(email: string, password: string): Promise<LoginResult | null>;
  signOut(headers: Headers): Promise<void>;
  getSessionUser(headers: Headers): Promise<User | null>;
}
