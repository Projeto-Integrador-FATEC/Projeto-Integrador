import { HttpError } from "@/lib/http-error";
import { Comment, CreateCommentData } from "@/models/comment.model";
import { ICommentRepository } from "@/repositories/interfaces/comment-repository.interface";
import { ICourseRepository } from "@/repositories/interfaces/course-repository.interface";
import { IUserRepository } from "@/repositories/interfaces/user-repository.interface";
import { ICommentService } from "./interfaces/comment-service.interface";

export class CommentService implements ICommentService {
  constructor(
    private readonly commentRepository: ICommentRepository,
    private readonly courseRepository: ICourseRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async getById(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findById(id);

    if (!comment) {
      throw new HttpError("Comentário não encontrado", 404);
    }

    return comment;
  }

  async getByCourseId(courseId: number): Promise<Comment[]> {
    return this.commentRepository.findByCourseId(courseId);
  }

  async create(data: CreateCommentData): Promise<Comment> {
    if (!data.emailUsuario) {
      throw new HttpError("Usuário não informado.", 400);
    }

    if (!data.cursoId) {
      throw new HttpError("ID do curso não informado.", 400);
    }

    if (!data.texto?.trim()) {
      throw new HttpError("Texto do comentário não informado.", 400);
    }

    const course = await this.courseRepository.findById(data.cursoId);

    if (!course) {
      throw new HttpError("Curso não encontrado", 404);
    }

    const user = await this.userRepository.findByEmail(data.emailUsuario);

    if (!user) {
      throw new HttpError("Usuário não encontrado", 404);
    }

    return this.commentRepository.create({ texto: data.texto, cursoId: course.id, userId: user.id });
  }
}
