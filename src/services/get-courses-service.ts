import api from "@/lib/axios";

export interface Course {
  id: number;
  nome: string;
  descricao: string;
  cargaHoraria: number;
  nivel: "iniciante" | "intermediario" | "avancado";
  imagemPath?: string;
}

export async function getCoursesService(): Promise<Course[]> {
  const response = await api.get(`/api/cursos`);
  
  if (!response.data) {
    throw new Error("Erro ao buscar cursos");
  }

  return response.data;
} 