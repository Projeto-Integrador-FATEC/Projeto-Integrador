import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cyan-100 px-4">
      <div className="text-center">
        <Image 
          src="/logo_img.svg" 
          alt="Study Lovers" 
          width={120} 
          height={120} 
          className="mx-auto mb-6" 
        />
        <h1 className="text-6xl font-bold text-violet-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-zinc-700 mb-4">Página não encontrada</h2>
        <p className="text-zinc-600 mb-8 max-w-md mx-auto">
          Ops! Parece que você se perdeu. A página que você está procurando não existe ou foi movida.
        </p>
        <Link href="/">
          <Button className="bg-violet-500 hover:bg-violet-600 text-white font-semibold shadow-md">
            Voltar para a página inicial
          </Button>
        </Link>
      </div>
    </div>
  );
} 