import api from "@/lib/axios";

export interface CourseDetails {
  id: number;
  nome: string;
  descricao: string;
  cargaHoraria: number;
  nivel: "iniciante" | "intermediario" | "avancado";
  imagemPath?: string;
  avaliacao: number;
  ultimaAtualizacao: string;
  totalAlunos: number;
  totalArrecadado: number;
  instituicao: {
    nome: string;
    logo: string;
  };
}

export async function getCourseDetailsService(id: number): Promise<CourseDetails> {
  const response = await api.get(`/api/cursos/${id}`);


  console.log("response", response);
  
  if (!response.data) {
    throw new Error("Erro ao buscar detalhes do curso");
  }

  return response.data;
} 