import api from "@/lib/axios";

export interface Comment {
    id: number;
    texto: string;
    date: string;
    rating?: number;
    curso: {
        id: number;
        nome: string;
        descricao: string;
        cargaHoraria: number;
        nivel: string;
        imagemPath: string;
        provider: string;
        url: string;
    };
    user: {
        id: number;
        email: string;
        name: string;
        password: string;
    };
}

export async function getCourseComments(courseId: string): Promise<Comment[]> {
    console.log("courseId", courseId);
    const response = await api.get(`/api/comentarios/curso/${courseId}`);
    return response.data;
}