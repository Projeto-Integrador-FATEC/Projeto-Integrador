import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BackButton } from "@/components/ui/back-button";
import { AdminRequestQueue } from "@/components/admin-request/admin-request-queue";
import { modules } from "@/services/modules";

export default async function SolicitacoesAdminPage() {
  const user = await modules.services.user.getSessionUser(await headers());

  if (!user?.seedAdmin) {
    redirect("/");
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
