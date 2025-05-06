import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo: Ilustração e texto */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-violet-500 shadow-lg">
        <Image src="/login_img.svg" alt="Login Ilustração" width={320} height={320} className="mb-6" />
        <p className="text-white text-lg max-w-md text-center px-6">
          Seja bem vindo, acesse e aproveite todo o conteúdo, somos uma equipe de profissionais empenhados em trazer o melhor conteúdo direcionado a você usuário.
        </p>
      </div>
      {/* Lado direito: Formulário de login */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-cyan-100">
        <div className="flex flex-col items-center w-full max-w-md px-8 py-12">
          <Image src="/logo_img.svg" alt="Study Lovers" width={60} height={60} className="object-contain mb-2" />
          <h1 className="text-3xl font-bold mb-8 mt-2">Bem Vindo !</h1>
          <form className="w-full flex flex-col gap-4">
            <Input type="email" placeholder="Email" className="bg-cyan-200 shadow-md focus:ring-2 focus:ring-violet-400" />
            <Input type="password" placeholder="Senha" className="bg-cyan-200 shadow-md focus:ring-2 focus:ring-violet-400" />
            <Button type="submit" className="bg-violet-500 hover:bg-violet-600 text-white font-semibold shadow-md mt-2">Entrar</Button>
          </form>
          <div className="mt-8 text-center w-full">
            <span className="text-zinc-700">Não possui conta? </span>
            <Link href="/cadastro" className="text-violet-500 hover:underline font-semibold">Cadastre-se</Link>
          </div>
        </div>
      </div>
    </div>
  );
} 