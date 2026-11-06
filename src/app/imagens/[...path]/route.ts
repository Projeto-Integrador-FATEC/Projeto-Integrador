import { toErrorResponse } from "@/lib/http-error";
import { modules } from "@/services/modules";

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const image = await modules.services.course.getImage(path.map(decodeURIComponent).join("/"));

    return new Response(image.body, {
      headers: {
        "Content-Type": image.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return toErrorResponse(error, "Erro ao buscar imagem");
  }
}
