import { Course, CourseImage, CourseSearchQuery, CourseSearchResult, CreateCourseData } from "@/models/course.model";

export interface ICourseService {
  getAll(): Promise<Course[]>;
  getById(id: number): Promise<Course>;
  search(query: CourseSearchQuery): Promise<CourseSearchResult>;
  create(data: CreateCourseData, userId: number): Promise<Course>;
  delete(id: number, userId: number): Promise<void>;
  getImage(path: string): Promise<CourseImage>;
}
