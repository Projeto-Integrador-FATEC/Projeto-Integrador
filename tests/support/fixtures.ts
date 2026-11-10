import { Category } from "@/models/category.model";
import { Course } from "@/models/course.model";
import { User } from "@/models/user.model";

export const tecnologia: Category = { id: 1, nome: "Tecnologia" };
export const gestao: Category = { id: 2, nome: "Gestão" };

export const aluno: User = {
  id: 1,
  name: "Estudante Fatec",
  email: "estudante@fatec.sp.gov.br",
  role: "ALUNO",
};

export const admin: User = {
  id: 2,
  name: "Admin",
  email: "admin@fatec.sp.gov.br",
  role: "ADMIN",
};

export function makeCourse(overrides: Partial<Course> = {}): Course {
  return {
    id: 10,
    nome: "Lógica de Programação",
    descricao: "Introdução à lógica de programação",
    cargaHoraria: 40,
    nivel: "iniciante",
    provider: "Fatec",
    url: "https://example.com/logica",
    imagemPath: null,
    categoria: tecnologia,
    categoria_id: tecnologia.id,
    ...overrides,
  };
}

export const cursoTecnologia = makeCourse();
export const cursoGestao = makeCourse({
  id: 11,
  nome: "Gestão de Projetos",
  descricao: "Fundamentos de gestão",
  categoria: gestao,
  categoria_id: gestao.id,
  url: "https://example.com/gestao",
});
