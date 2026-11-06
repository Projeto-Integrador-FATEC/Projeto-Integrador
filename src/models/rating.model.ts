import { Course } from "./course.model";
import { User } from "./user.model";

export interface Rating {
  id: number;
  nota: number;
  dataAvaliacao: Date | string;
  user: User;
  curso: Course;
}

export interface CreateRatingData {
  nota: number;
  email: string;
  cursoId: number;
}
