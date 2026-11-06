import { Course } from "./course.model";
import { User } from "./user.model";

export interface Comment {
  id: number;
  texto: string;
  date: Date | string;
  user: User;
  curso: Course;
}

export interface CreateCommentData {
  texto: string;
  cursoId: number;
  emailUsuario: string;
}
