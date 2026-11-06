import { CreateUserData, User } from "@/models/user.model";

export interface IUserService {
  getAll(): Promise<User[]>;
  getById(id: number): Promise<User>;
  getByEmail(email: string): Promise<User>;
  create(data: CreateUserData): Promise<User>;
  authenticate(email: string, password: string): Promise<User | null>;
}
