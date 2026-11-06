import { prisma } from "@/lib/prisma";
import { Category } from "@/models/category.model";
import { ICategoryRepository } from "./interfaces/category-repository.interface";

export class CategoryRepository implements ICategoryRepository {
  async findAll(): Promise<Category[]> {
    return prisma.categoria.findMany({ orderBy: { id: "asc" } });
  }

  async findById(id: number): Promise<Category | null> {
    return prisma.categoria.findUnique({ where: { id } });
  }
}
