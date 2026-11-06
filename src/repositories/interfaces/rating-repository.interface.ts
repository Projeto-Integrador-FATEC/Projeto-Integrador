import { Rating } from "@/models/rating.model";

export interface IRatingRepository {
  findByCourseId(courseId: number): Promise<Rating[]>;
  averageByCourseId(courseId: number): Promise<number | null>;
  create(data: { nota: number; cursoId: number; userId: number }): Promise<Rating>;
}
