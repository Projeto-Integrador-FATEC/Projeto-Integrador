import { HttpError } from "@/lib/http-error";
import { Course, CourseImage, CreateCourseData } from "@/models/course.model";
import { ICategoryRepository } from "@/repositories/interfaces/category-repository.interface";
import { ICourseRepository } from "@/repositories/interfaces/course-repository.interface";
import { IStorageRepository } from "@/repositories/interfaces/storage-repository.interface";
import { ICourseService } from "./interfaces/course-service.interface";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export class CourseService implements ICourseService {
  constructor(
    private readonly courseRepository: ICourseRepository,
    private readonly categoryRepository: ICategoryRepository,
    private readonly storageRepository: IStorageRepository
  ) {}

  async getAll(): Promise<Course[]> {
    return this.courseRepository.findAll();
  }

  async getById(id: number): Promise<Course> {
    const course = await this.courseRepository.findById(id);

    if (!course) {
      throw new HttpError("Curso não encontrado", 404);
    }

    return course;
  }

  async create(data: CreateCourseData): Promise<Course> {
    const { image, ...courseData } = data;
    const categoryId = courseData.categoria_id ? courseData.categoria_id : null;

    if (categoryId !== null && !(await this.categoryRepository.findById(categoryId))) {
      throw new HttpError("Categoria não encontrada", 400);
    }

    let imagemPath: string | null = null;

    if (image && image.size > 0) {
      if (image.size > MAX_IMAGE_SIZE) {
        throw new HttpError("A imagem deve ter no máximo 10MB", 400);
      }

      imagemPath = `${Date.now()}_${this.sanitizeFileName(image.name)}`;
      await this.storageRepository.upload(imagemPath, image);
    }

    return this.courseRepository.create({ ...courseData, categoria_id: categoryId, imagemPath });
  }

  async getImage(path: string): Promise<CourseImage> {
    const image = await this.storageRepository.download(path);

    if (!image) {
      throw new HttpError("Imagem não encontrada", 404);
    }

    return image;
  }

  private sanitizeFileName(name: string): string {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase();
  }
}
