"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { CourseForm } from "@/components/course-form";
import { BackButton } from "@/components/ui/back-button";
import { Course } from "@/models/course.model";

export default function EditarCursoPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const userId = session?.user?.id ? Number(session.user.id) : null;

  useEffect(() => {
    if (!isPending && session?.user?.role !== "ADMIN") {
      router.replace("/");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    async function loadCourse() {
      try {
        const response = await fetch(`/api/cursos/${params.id}`);

        if (!response.ok) {
          throw new Error("Curso não encontrado");
        }

        const data: Course = await response.json();
        setCourse(data);
      } catch {
        toast.error("Erro ao carregar o curso");
      } finally {
        setIsLoading(false);
      }
    }

    loadCourse();
  }, [params.id]);

  useEffect(() => {
    if (!course || userId === null) {
      return;
    }

    if (!(course.responsavelIds ?? []).includes(userId)) {
      toast.error("Somente os responsáveis pelo curso podem editá-lo");
      router.replace(`/curso-details/${course.id}`);
    }
  }, [course, userId, router]);

  if (isPending || isLoading) {
    return <p className="p-8">Carregando...</p>;
  }

  if (session?.user?.role !== "ADMIN" || !course || userId === null || !(course.responsavelIds ?? []).includes(userId)) {
    return null;
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8">
        <div className="flex flex-col items-start gap-4">
          <BackButton />
          <h1 className="text-3xl font-bold">Editar curso</h1>
        </div>
        <CourseForm mode="edit" course={course} />
      </div>
    </div>
  );
}
