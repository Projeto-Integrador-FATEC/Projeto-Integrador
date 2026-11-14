import { HttpError } from "@/lib/http-error";
import { Course, CourseImage, CourseSearchQuery, CourseSearchResult, CreateCourseData } from "@/models/course.model";
import { ICategoryRepository } from "@/repositories/interfaces/category-repository.interface";
import { ICourseRepository } from "@/repositories/interfaces/course-repository.interface";
import { IStorageRepository } from "@/repositories/interfaces/storage-repository.interface";
import { ICourseService } from "./interfaces/course-service.interface";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const COURSE_LEVELS = ["iniciante", "intermediario", "avancado"] as const;
const DEFAULT_SEARCH_LIMIT = 10;

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

  async search(query: CourseSearchQuery): Promise<CourseSearchResult> {
    const limite = query.limite ?? DEFAULT_SEARCH_LIMIT;

    if (!Number.isInteger(limite) || limite < 1 || limite > DEFAULT_SEARCH_LIMIT) {
      throw new HttpError("O limite da busca deve ficar entre 1 e 10", 400);
    }

    const termo = query.termo?.trim();

    if (termo && termo.length > 100) {
      throw new HttpError("O termo de busca deve ter no máximo 100 caracteres", 400);
    }

    let nivel: string | undefined;

    if (query.nivel?.trim()) {
      nivel = fold(query.nivel);

      if (!COURSE_LEVELS.includes(nivel as (typeof COURSE_LEVELS)[number])) {
        throw new HttpError("Nível inválido", 400);
      }
    }

    const categoria = query.categoria?.trim();
    const categoriaId = categoria ? await this.resolveCategoryId(categoria) : undefined;

    return this.courseRepository.search({
      termo: termo || undefined,
      nivel,
      categoriaId,
      limite,
    });
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

  private async resolveCategoryId(nome: string): Promise<number> {
    const alvo = fold(nome);
    const categories = await this.categoryRepository.findAll();
    const exact = categories.filter((category) => fold(category.nome) === alvo);
    const matches = exact.length > 0 ? exact : categories.filter((category) => fold(category.nome).includes(alvo));

    if (matches.length === 0) {
      throw new HttpError("Categoria não encontrada", 404);
    }

    if (matches.length > 1) {
      throw new HttpError(`Há mais de uma categoria parecida: ${matches.map((category) => category.nome).join(", ")}`, 400);
    }

    return matches[0].id;
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

function fold(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}
