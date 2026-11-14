import Image from "next/image";
import Link from "next/link";
import { CircleCheck, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ERROR_MESSAGES: Record<string, string> = {
  TOKEN_EXPIRED: "O link de confirmação expirou.",
  INVALID_TOKEN: "O link de confirmação é inválido.",
  USER_NOT_FOUND: "Não encontramos a conta vinculada a este link.",
};

interface EmailVerifiedPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function EmailVerifiedPage({ searchParams }: EmailVerifiedPageProps) {
  const { error } = await searchParams;
  const success = !error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyan-100 dark:bg-zinc-900 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="flex flex-col items-center gap-3">
          {success ? (
            <CircleCheck className="size-12 text-green-500" />
          ) : (
            <CircleX className="size-12 text-red-500" />
          )}
          <CardTitle className="text-2xl">
            {success ? "E-mail confirmado!" : "Não foi possível confirmar"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            {success
              ? "Sua conta foi verificada com sucesso. Aproveite todo o conteúdo do Study Lovers."
              : ERROR_MESSAGES[error] ?? "Ocorreu um erro ao confirmar seu e-mail."}
          </CardDescription>
        </CardContent>
        <CardFooter className="justify-center">
          <Button asChild className="bg-violet-500 hover:bg-violet-600 text-white font-semibold">
            <Link href={success ? "/" : "/login"}>{success ? "Ir para o início" : "Ir para o login"}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
