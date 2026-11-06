import { prisma } from "@/lib/prisma";
import { CreateUserData, User, UserWithPassword } from "@/models/user.model";
import { IUserRepository } from "./interfaces/user-repository.interface";
import { toUser } from "./mappers";

export class UserRepository implements IUserRepository {
  async findAll(): Promise<User[]> {
    const rows = await prisma.user.findMany({ orderBy: { id: "asc" } });
    return rows.map(toUser);
  }

  async findById(id: number): Promise<User | null> {
    const row = await prisma.user.findUnique({ where: { id } });
    return row ? toUser(row) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await prisma.user.findUnique({ where: { email } });
    return row ? toUser(row) : null;
  }

  async findByEmailWithPassword(email: string): Promise<UserWithPassword | null> {
    const row = await prisma.user.findUnique({ where: { email } });
    return row ? { ...toUser(row), password: row.password } : null;
  }

  async create(data: CreateUserData & { role: string }): Promise<User> {
    const row = await prisma.user.create({ data });
    return toUser(row);
  }
}
