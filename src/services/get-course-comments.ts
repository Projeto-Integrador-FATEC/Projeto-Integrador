import api from "@/lib/axios";

export interface Comment {
    id: string;
    author: string;
    content: string;
    date: string;
    rating: number;
    avatar?: string;
  }

export async function getCourseComments(courseId: string): Promise<Comment[]> {
    const response = await api.get(`/api/cursos/${courseId}/comentarios`);
    return response.data;
}