import { CourseImage } from "@/models/course.model";

export interface IStorageRepository {
  upload(path: string, file: File): Promise<void>;
  download(path: string): Promise<CourseImage | null>;
}
