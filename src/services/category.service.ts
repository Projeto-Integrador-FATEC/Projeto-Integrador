import { HttpError } from "@/lib/http-error";
import { Category } from "@/models/category.model";
import { Course } from "@/models/course.model";
import { ICategoryRepository } from "@/repositories/interfaces/category-repository.interface";
import { ICourseRepository } from "@/repositories/interfaces/course-repository.interface";
import { ICategoryService } from "./interfaces/category-service.interface";

export class CategoryService implements ICategoryService {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly courseRepository: ICourseRepository
  ) {}

  async getAll(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async getById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new HttpError("Categoria não encontrada", 404);
    }

    return category;
  }

  async getCoursesByCategory(categoryId: number): Promise<Course[]> {
    return this.courseRepository.findByCategoryId(categoryId);
  }
}
