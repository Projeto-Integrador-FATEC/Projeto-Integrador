import Image from "next/image";
import Link from "next/link";
import { SignUp } from "./_components/sign-up";

export default function CadastroPage() {
  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo: Ilustração e texto */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-violet-500 shadow-lg">
        <Image src="/login_img.svg" alt="Cadastro Ilustração" width={320} height={320} className="mb-6" />
        <p className="text-white text-lg max-w-md text-center px-6">
          Junte-se a nós! Crie sua conta e comece sua jornada de aprendizado com os melhores cursos gratuitos.
        </p>
      </div>
      {/* Lado direito: Formulário de cadastro */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-cyan-100">
        <div className="flex flex-col items-center w-full max-w-md px-8 py-12">
          <Image src="/logo_img.svg" alt="Study Lovers" width={60} height={60} className="object-contain mb-2" />
          <h1 className="text-3xl font-bold mb-8 mt-2">Criar Conta</h1>
          <SignUp />
          <div className="mt-8 text-center w-full">
            <span className="text-zinc-700">Já possui conta? </span>
            <Link href="/login" className="text-violet-500 hover:underline font-semibold">Faça login</Link>
          </div>
        </div>
      </div>
    </div>
  );
} 