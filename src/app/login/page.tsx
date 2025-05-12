import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignIn } from "./_components/sign-in";
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
          <SignIn />
          <div className="mt-8 text-center w-full">
            <span className="text-zinc-700">Não possui conta? </span>
            <Link href="/cadastro" className="text-violet-500 hover:underline font-semibold">Cadastre-se</Link>
          </div>
        </div>
      </div>
    </div>
  );
} 