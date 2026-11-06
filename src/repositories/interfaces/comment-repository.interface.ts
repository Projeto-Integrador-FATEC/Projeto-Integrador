import { Comment } from "@/models/comment.model";

export interface ICommentRepository {
  findById(id: number): Promise<Comment | null>;
  findByCourseId(courseId: number): Promise<Comment[]>;
  create(data: { texto: string; cursoId: number; userId: number }): Promise<Comment>;
}
