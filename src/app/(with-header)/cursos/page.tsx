import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CursosPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex flex-col items-start max-w-6xl w-full mx-auto mt-12 px-4">
        <h2 className="text-3xl font-bold mb-10">Vamos começar a aprender, Daniel</h2>
        <Card className="w-[350px] pb-6 pt-0">
          <Image src="/img_curso.svg" alt="Curso de Informática" width={350} height={180} className="rounded-t-xl object-cover" />
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Curso de Informática</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Curso gratuito e de qualidade para capacitação e qualificação profissional
            </CardDescription>
            <Button className="bg-violet-500 hover:bg-violet-600 text-white w-32 cursor-pointer">Participar</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
} 