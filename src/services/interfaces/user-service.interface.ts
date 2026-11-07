import { CreateUserData, LoginResult, User } from "@/models/user.model";

export interface IUserService {
  getAll(): Promise<User[]>;
  getById(id: number): Promise<User>;
  getByEmail(email: string): Promise<User>;
  create(data: CreateUserData): Promise<User>;
  login(email: string, password: string): Promise<LoginResult | null>;
  logout(headers: Headers): Promise<void>;
  getSessionUser(headers: Headers): Promise<User | null>;
}
