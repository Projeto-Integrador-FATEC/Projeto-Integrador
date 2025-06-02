"use client";

import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Course } from "@/services/get-courses-service";
import { toast } from "sonner";

export default function CursosPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const response = await fetch("/api/courses");
        if (!response.ok) {
          throw new Error("Erro ao carregar cursos");
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        toast.error("Erro ao carregar cursos");
      } finally {
        setIsLoading(false);
      }
    }

    loadCourses();
  }, []);

  return (
    <div className="min-h-screen bg-background dark:bg-zinc-900 flex flex-col">
      <main className="flex flex-col items-start max-w-6xl w-full mx-auto mt-12 px-4">
        <h2 className="text-3xl font-bold mb-10 text-zinc-900 dark:text-white">
          Vamos começar a aprender,<span className="text-violet-500">Daniel</span>
        </h2>
        
        {isLoading ? (
          <div className="text-zinc-600 dark:text-zinc-400">Carregando cursos...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {courses.map((course) => (
              <Card key={course.id} className="w-full pb-6 pt-0 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                <Image 
                  src={"http://localhost:4080/imagens/" + course.imagemPath || "/img_curso.svg"} 
                  alt={course.nome} 
                  width={350} 
                  height={180} 
                  className="w-full h-[180px] rounded-t-xl object-cover" 
                />
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-zinc-900 dark:text-white">{course.nome}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-zinc-600 dark:text-zinc-400">
                    {course.descricao}
                  </CardDescription>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {course.cargaHoraria}h • {course.nivel}
                    </span>
                    <Link href={`/curso-details/${course.id}`}>
                      <Button className="bg-violet-500 hover:bg-violet-600 text-white w-32 cursor-pointer">
                        Participar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 