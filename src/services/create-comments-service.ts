import api from "@/lib/axios";

interface CreateCommentsParams {
  cursoId: string;
  emailUsuario: string;
  texto: string;
}

export async function createCommentsService(comentario : CreateCommentsParams) {
  console.log("comentario", comentario);
  const response = await api.post(`/api/comentarios`, {
    texto : comentario.texto,
    emailUsuario : comentario.emailUsuario,
    cursoId : comentario.cursoId
  });
  console.log("response", response);
  return response.data;
} 