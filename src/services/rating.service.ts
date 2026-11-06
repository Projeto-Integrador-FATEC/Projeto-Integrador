import { HttpError } from "@/lib/http-error";
import { CreateRatingData, Rating } from "@/models/rating.model";
import { ICourseRepository } from "@/repositories/interfaces/course-repository.interface";
import { IRatingRepository } from "@/repositories/interfaces/rating-repository.interface";
import { IUserRepository } from "@/repositories/interfaces/user-repository.interface";
import { IRatingService } from "./interfaces/rating-service.interface";

export class RatingService implements IRatingService {
  constructor(
    private readonly ratingRepository: IRatingRepository,
    private readonly courseRepository: ICourseRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async create(data: CreateRatingData): Promise<Rating> {
    if (!Number.isInteger(data.nota) || data.nota < 1 || data.nota > 10) {
      throw new HttpError("Nota inválida. Envie um número de 1 a 10.", 400);
    }

    if (!data.email) {
      throw new HttpError("Usuário não informado.", 400);
    }

    const course = await this.courseRepository.findById(data.cursoId);

    if (!course) {
      throw new HttpError("Curso não encontrado", 404);
    }

    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new HttpError("Usuário não encontrado", 404);
    }

    return this.ratingRepository.create({ nota: data.nota, cursoId: course.id, userId: user.id });
  }

  async getByCourseId(courseId: number): Promise<Rating[]> {
    return this.ratingRepository.findByCourseId(courseId);
  }

  async getAverageByCourseId(courseId: number): Promise<number> {
    return (await this.ratingRepository.averageByCourseId(courseId)) ?? 0;
  }
}
