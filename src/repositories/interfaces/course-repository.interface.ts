import { Course, SaveCourseData } from "@/models/course.model";

export interface ICourseRepository {
  findAll(): Promise<Course[]>;
  findById(id: number): Promise<Course | null>;
  findByCategoryId(categoryId: number): Promise<Course[]>;
  create(data: SaveCourseData): Promise<Course>;
}
