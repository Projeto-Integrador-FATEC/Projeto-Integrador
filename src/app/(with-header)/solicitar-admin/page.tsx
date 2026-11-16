"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { BackButton } from "@/components/ui/back-button";
import { RequestAdminForm } from "@/components/admin-request/request-admin-form";

export default function SolicitarAdminPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (session?.user?.role === "ADMIN") {
      router.replace("/");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return <p className="p-8">Carregando...</p>;
  }

  if (session?.user?.role === "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background dark:bg-zinc-900">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <BackButton className="mb-4" />
        <h1 className="mb-6 text-3xl font-bold text-zinc-900 dark:text-white">
          Tornar-se administrador
        </h1>
        <RequestAdminForm />
      </div>
    </div>
  );
}
