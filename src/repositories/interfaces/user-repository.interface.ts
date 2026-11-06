import { CreateUserData, User, UserWithPassword } from "@/models/user.model";

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByEmailWithPassword(email: string): Promise<UserWithPassword | null>;
  create(data: CreateUserData & { role: string }): Promise<User>;
}
