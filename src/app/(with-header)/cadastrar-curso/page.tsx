"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { CourseForm } from "@/components/course-form";
import { BackButton } from "@/components/ui/back-button";

export default function CadastrarCursoPage() {
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
    <div className="bg-background min-h-screen">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8">
        <div className="flex flex-col items-start gap-4">
          <BackButton />
          <h1 className="text-3xl font-bold">Cadastrar Novo Curso</h1>
        </div>
        <CourseForm mode="create" />
      </div>
    </div>
  );
}
