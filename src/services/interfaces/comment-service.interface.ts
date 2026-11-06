import { Comment, CreateCommentData } from "@/models/comment.model";

export interface ICommentService {
  getById(id: number): Promise<Comment>;
  getByCourseId(courseId: number): Promise<Comment[]>;
  create(data: CreateCommentData): Promise<Comment>;
}
