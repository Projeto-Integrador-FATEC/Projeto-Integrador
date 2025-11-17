import api from "@/lib/axios";

export interface CreateCourseData {
  nome: string;
  descricao: string;
  cargaHoraria: number;
  nivel: "iniciante" | "intermediario" | "avancado";
  provider: string;
  url: string;
  categoria_id?: number | null;
  image?: File;
}

export async function createCourseService(data: CreateCourseData) {
  const formData = new FormData();
  
  console.log("Dados do curso a ser criado", data);
  

  // Enviar o JSON como Blob
  formData.append("curso", new Blob(
    [JSON.stringify(data)], { type: "application/json" }
  ));
  
  if (data.image) {
    formData.append("imagem", data.image);
  }

  const response = await api.post("/api/cursos", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
} 