"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { BackButton } from "@/components/ui/back-button";
import { AdminRequestQueue } from "@/components/admin-request/admin-request-queue";

export default function SolicitacoesAdminPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && session?.user?.role !== "ADMIN") {
      router.replace("/");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return <p className="p-8">Carregando...</p>;
  }

  if (session?.user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background dark:bg-zinc-900">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <BackButton className="mb-4" />
        <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">
          Chamados de administrador
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Aceite ou recuse pedidos de alunos que querem cadastrar cursos.
        </p>
        <AdminRequestQueue />
      </div>
    </div>
  );
}