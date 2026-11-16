import {
  Course,
  CourseSearchFilters,
  CourseSearchResult,
  SaveCourseData,
  UpdateSaveCourseData,
} from "@/models/course.model";

export interface ICourseRepository {
  findAll(): Promise<Course[]>;
  findById(id: number): Promise<Course | null>;
  findByCategoryId(categoryId: number): Promise<Course[]>;
  search(filters: CourseSearchFilters): Promise<CourseSearchResult>;
  create(data: SaveCourseData): Promise<Course>;
  update(id: number, data: UpdateSaveCourseData): Promise<Course>;
  delete(id: number): Promise<void>;
}
