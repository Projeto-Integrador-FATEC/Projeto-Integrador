import { Course, CourseSearchFilters, CourseSearchResult, SaveCourseData } from "@/models/course.model";

export interface ICourseRepository {
  findAll(): Promise<Course[]>;
  findById(id: number): Promise<Course | null>;
  findByCategoryId(categoryId: number): Promise<Course[]>;
  search(filters: CourseSearchFilters): Promise<CourseSearchResult>;
  create(data: SaveCourseData): Promise<Course>;
}
