import { CreateRatingData, Rating } from "@/models/rating.model";

export interface IRatingService {
  create(data: CreateRatingData): Promise<Rating>;
  getByCourseId(courseId: number): Promise<Rating[]>;
  getAverageByCourseId(courseId: number): Promise<number>;
}
