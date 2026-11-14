import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface VerifiqueSeuEmailPageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function VerifiqueSeuEmailPage({
  searchParams,
}: VerifiqueSeuEmailPageProps) {
  const { email } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyan-100 dark:bg-zinc-900 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="flex flex-col items-center gap-3">
          <Mail className="size-12 text-violet-500" />
          <CardTitle className="text-2xl">Verifique seu e-mail</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardDescription>
            Conta criada com sucesso. Enviamos um link de confirmação
            {email ? (
              <>
                {" "}
                para <span className="font-semibold text-foreground">{email}</span>
              </>
            ) : null}
            .
          </CardDescription>
          <CardDescription>
            Abra a mensagem e clique em <span className="font-semibold text-foreground">Confirmar e-mail</span>{" "}
            para validar sua conta.
          </CardDescription>
          <CardDescription>
            Se o e-mail não aparecer, confira a caixa de spam ou a lixeira. O link pode expirar; nesse caso, volte
            mais tarde e solicite um novo envio.
          </CardDescription>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <Button asChild className="w-full bg-violet-500 hover:bg-violet-600 text-white font-semibold">
            <Link href="/">Ir para o início</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full text-violet-500 hover:text-violet-600">
            <Link href="/login">Já confirmou? Faça login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
