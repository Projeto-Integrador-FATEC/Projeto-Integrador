import { Course, CourseImage, CreateCourseData } from "@/models/course.model";

export interface ICourseService {
  getAll(): Promise<Course[]>;
  getById(id: number): Promise<Course>;
  create(data: CreateCourseData): Promise<Course>;
  getImage(path: string): Promise<CourseImage>;
}
