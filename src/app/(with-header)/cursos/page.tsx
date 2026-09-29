import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "../../../../auth";

interface Curso {
  id: number;
  nome: string;
  descricao: string;
  cargaHoraria: number;
  nivel: string;
  provider: string;
  url: string;
  imagemPath: string | null;
}

export default async function CursosPage() {
  const session = await auth();
  const nome = session?.user?.name || "usuário";

  const response = await fetch("http://localhost:4080/api/cursos", {
    cache: "no-store",
  });

  const cursos: Curso[] = response.ok ? await response.json() : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex flex-col items-start max-w-6xl w-full mx-auto mt-12 px-4">
        <h2 className="text-3xl font-bold mb-10">
          Vamos começar a aprender,{" "}
          <span className="text-violet-500">{nome}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {cursos.map((curso) => (
            <Card key={curso.id} className="w-full pb-6 pt-0 overflow-hidden">
              <img
                src={
                  curso.imagemPath
                    ? `http://localhost:4080/imagens/${curso.imagemPath}`
                    : "/img_curso.svg"
                }
                alt={curso.nome}
                className="w-full h-[180px] object-cover"
              />

              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {curso.nome}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <CardDescription className="mb-4">
                  {curso.descricao}
                </CardDescription>

                <div className="text-sm text-zinc-600 mb-4">
                  <p>
                    <strong>Carga Horária:</strong>{" "}
                    {curso.cargaHoraria} horas
                  </p>

                  <p>
                    <strong>Nível:</strong>{" "}
                    {curso.nivel}
                  </p>

                  <p>
                    <strong>Plataforma:</strong>{" "}
                    {curso.provider}
                  </p>
                </div>

                <a
                  href={curso.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-violet-500 hover:bg-violet-600 text-white w-32 cursor-pointer">
                    Participar
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        {cursos.length === 0 && (
          <p className="text-zinc-500">
            Nenhum curso disponível.
          </p>
        )}
      </main>
    </div>
  );
}