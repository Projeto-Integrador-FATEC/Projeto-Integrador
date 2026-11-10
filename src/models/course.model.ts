import { Category } from "./category.model";

export type CourseLevel = "iniciante" | "intermediario" | "avancado";

export interface Course {
  id: number;
  nome: string;
  descricao: string;
  cargaHoraria: number;
  nivel: string;
  provider: string;
  url: string;
  imagemPath: string | null;
  categoria: Category | null;
  categoria_id: number | null;
}

export interface CourseDetails extends Course {
  avaliacao?: number;
  ultimaAtualizacao?: string;
  totalAlunos?: number;
  totalArrecadado?: number;
}

export interface CreateCourseData {
  nome: string;
  descricao: string;
  cargaHoraria: number;
  nivel: string;
  provider: string;
  url: string;
  categoria_id?: number | null;
  image?: File | null;
}

export interface SaveCourseData extends Omit<CreateCourseData, "image"> {
  imagemPath?: string | null;
}

export interface CourseImage {
  body: ArrayBuffer;
  contentType: string;
}

export interface CourseSearchQuery {
  termo?: string;
  nivel?: string;
  categoria?: string;
  limite?: number;
}

export interface CourseSearchFilters {
  termo?: string;
  nivel?: string;
  categoriaId?: number;
  limite: number;
}

export interface CourseSearchResult {
  total: number;
  courses: Course[];
}
