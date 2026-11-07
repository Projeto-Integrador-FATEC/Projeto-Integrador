import { prisma } from "@/lib/prisma";
import { User } from "@/models/user.model";
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
}
