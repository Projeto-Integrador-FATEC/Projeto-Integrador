import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Clock, Users, CalendarDays, FileText } from "lucide-react";

export default function CursoDetailsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col mb-8">
      {/* Banner do curso */}
      <section className="w-full bg-cyan-100 py-12 px-4 flex flex-col md:flex-row items-start md:items-center justify-between relative">
        <div className="flex justify-between items-center w-full max-w-6xl mx-auto">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold text-zinc-900 mb-4">Curso de Informática</h1>
          </div>

          <Card className="absolute md:static right-8 top-8 md:ml-8 w-[320px] shadow-lg p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-zinc-700"><ThumbsUp className="w-5 h-5" /> Avaliação <span className="ml-auto font-semibold">9.4</span></div>
            <div className="flex items-center gap-2 text-zinc-700"><Clock className="w-5 h-5" /> Carga Horária <span className="ml-auto font-semibold">8h</span></div>
            <div className="flex items-center gap-2 text-zinc-700"><CalendarDays className="w-5 h-5" /> Última Atualização <span className="ml-auto font-semibold">17/01/2006</span></div>
            <div className="flex items-center gap-2 text-zinc-700"><Users className="w-5 h-5" /> Alunos <span className="ml-auto font-semibold">4000</span></div>
          </Card>
        </div>
      </section>

      {/* Botões de ação */}
      <div className="flex justify-between items-center w-full max-w-6xl mx-auto mt-8 px-4">
        <div className="flex gap-4">
          <Button className="bg-violet-500 hover:bg-violet-600 text-white font-semibold shadow-md">Participar</Button>
          <Button variant="outline" className="border-violet-500 text-violet-500 font-semibold shadow-md">Adicionar um plano de estudos</Button>
        </div>
        <Button className="bg-violet-500 hover:bg-violet-600 text-white font-semibold shadow-md">Realizar Doação</Button>
      </div>

      {/* Informações do curso */}
      <section className="max-w-6xl w-full mx-auto mt-12 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <div className="text-xl font-semibold mb-2">Curso Oferecido Por</div>
            <Image src="/bradesco_img.svg" alt="Fundação Bradesco" width={100} height={40} className="object-contain mb-2" />
          </div>
          <div className="text-right mt-6 md:mt-0">
            <div className="text-xl font-semibold">Total Arrecadado</div>
            <div className="text-lg font-bold text-zinc-700">R$3.500,00</div>
          </div>
        </div>
        
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2 text-xl font-semibold"><FileText className="w-6 h-6" />Descrição</div>
          <div className="text-zinc-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla non massa pharetra, euismod urna a, ultrices eros. Mauris quis eleifend velit. Donec magna tellus, fringilla a justo pellentesque, semper tincidunt ex. Suspendisse suscipit sem id mi fringilla, ut posuere eros ullamcorper. Sed venenatis sit amet diam nec interdum. Integer aliquam interdum sapien, id fringilla turpis pellentesque vel. Nulla elementum laoreet enim sit amet lobortis. Integer ornare congue mi, et porttitor augue gravida nec.
          </div>
        </Card>
      </section>
    </div>
  );
} 