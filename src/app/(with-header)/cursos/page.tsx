"use client";

import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Course } from "@/services/get-courses-service";
import { toast } from "sonner";
import { BackButton } from "@/components/ui/back-button";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategories } from "@/services/categories-service";

export default function CursosPage() {
  const session = useSession();
  const nome = session.data?.user?.name;
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const categories = getCategories();

  useEffect(() => {
    async function loadCourses() {
      try {
        const response = await fetch("/api/courses");
        if (!response.ok) {
          throw new Error("Erro ao carregar cursos");
        }
        const data = await response.json();
        setCourses(data);
        setFilteredCourses(data);
      } catch (error) {
        toast.error("Erro ao carregar cursos");
      } finally {
        setIsLoading(false);
      }
    }

    loadCourses();
  }, []);

  useEffect(() => {
    let filtered = courses.filter((course) =>
      course.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filtrar por categoria se uma categoria foi selecionada
    if (selectedCategory !== null) {
      filtered = filtered.filter((course) => course.categoria_id === selectedCategory);
    }

    setFilteredCourses(filtered);
  }, [searchTerm, selectedCategory, courses]);

  return (
    <div className="min-h-screen bg-background dark:bg-zinc-900 flex flex-col">
      <main className="flex flex-col items-start max-w-6xl w-full mx-auto mt-12 px-4">

        <BackButton className="mb-4" />
        
        <h2 className="text-3xl font-bold mb-6 text-zinc-900 dark:text-white">
          Vamos começar a aprender,<span className="text-violet-500"> {nome}</span>
        </h2>

        {/* Barra de pesquisa e filtro */}
        <div className="w-full flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={20} />
            <Input
              type="text"
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
            />
          </div>
          
          <Select 
            value={selectedCategory?.toString() || "all"} 
            onValueChange={(value) => {
              if (value === "all") {
                setSelectedCategory(null);
              } else {
                setSelectedCategory(parseInt(value));
              }
            }}
          >
            <SelectTrigger className="w-full sm:w-[200px] bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {isLoading ? (
          <div className="text-zinc-600 dark:text-zinc-400">Carregando cursos...</div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-zinc-600 dark:text-zinc-400">
            {searchTerm || selectedCategory !== null 
              ? `Nenhum curso encontrado${searchTerm ? ` para "${searchTerm}"` : ""}${selectedCategory !== null ? ` na categoria "${categories.find(cat => cat.id === selectedCategory)?.nome || ""}"` : ""}`
              : "Nenhum curso disponível"}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filteredCourses.map((course) => (
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
                <CardContent className="h-full flex flex-col justify-between">
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