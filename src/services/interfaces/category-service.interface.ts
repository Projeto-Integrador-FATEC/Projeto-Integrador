import { Category } from "@/models/category.model";
import { Course } from "@/models/course.model";

export interface ICategoryService {
  getAll(): Promise<Category[]>;
  getById(id: number): Promise<Category>;
  getCoursesByCategory(categoryId: number): Promise<Course[]>;
}
