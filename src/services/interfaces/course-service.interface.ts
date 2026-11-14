import { Course, CourseImage, CourseSearchQuery, CourseSearchResult, CreateCourseData } from "@/models/course.model";

export interface ICourseService {
  getAll(): Promise<Course[]>;
  getById(id: number): Promise<Course>;
  search(query: CourseSearchQuery): Promise<CourseSearchResult>;
  create(data: CreateCourseData): Promise<Course>;
  getImage(path: string): Promise<CourseImage>;
}
