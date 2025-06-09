import api from "@/lib/axios";

interface RateCourseParams {
  cursoId: string;
  email: string;
  nota: number;
}

export async function rateCourseService(avaliacao : RateCourseParams) {
  const response = await api.post(`/api/avaliacoes`, {
    avaliacao,
  });
  return response.data;
} 