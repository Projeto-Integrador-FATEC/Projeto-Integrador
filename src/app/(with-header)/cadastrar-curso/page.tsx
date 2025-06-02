"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CadastrarCursoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Adiciona a imagem ao FormData se ela existir
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await fetch("http://localhost:3000/api/courses", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      toast.success("Curso cadastrado com sucesso!");
      router.push("/");
    } catch (error: any) {
      console.error("Error creating course:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-zinc-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-violet-500 hover:text-violet-600">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Cadastrar Novo Curso</h1>
        </div>

        <Card className="p-6 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações básicas */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Informações Básicas</h2>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Nome do Curso *
                </label>
                <Input
                  name="name"
                  required
                  placeholder="Ex: Curso de Informática Básica" 
                  className="shadow-md focus:ring-2 focus:ring-violet-400 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Descrição *
                </label>
                <Textarea
                  name="description"
                  required
                  placeholder="Descreva o conteúdo e objetivos do curso..." 
                  className="shadow-md focus:ring-2 focus:ring-violet-400 min-h-[120px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Carga Horária (horas) *
                  </label>
                  <Input
                    name="workload"
                    required
                    type="number" 
                    placeholder="Ex: 40" 
                    className="shadow-md focus:ring-2 focus:ring-violet-400 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Nível do Curso *
                  </label>
                  <select 
                    name="level"
                    required
                    className="w-full h-9 rounded-md border border-input px-3 py-1 text-sm shadow-sm focus:ring-2 focus:ring-violet-400 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  >
                    <option value="">Selecione o nível</option>
                    <option value="iniciante">Iniciante</option>
                    <option value="intermediario">Intermediário</option>
                    <option value="avancado">Avançado</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Imagem do curso */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Imagem do Curso</h2>
              
              <div className="border-2 border-dashed border-violet-200 dark:border-violet-800 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="w-12 h-12 text-violet-500" />
                  <div className="text-zinc-600 dark:text-zinc-400">
                    <p className="font-medium">Arraste uma imagem ou clique para selecionar</p>
                    <p className="text-sm">PNG, JPG até 5MB</p>
                  </div>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button 
                    type="button"
                    variant="outline" 
                    className="mt-2 border-violet-500 text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900"
                    onClick={() => document.getElementById("image")?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Selecionar Imagem
                  </Button>
                  {selectedImage && (
                    <p className="text-sm text-violet-500 mt-2">
                      {selectedImage.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex gap-4 pt-4">
              <Button 
                type="button"
                variant="outline" 
                className="flex-1 border-violet-500 text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900"
                onClick={() => router.push("/")}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-violet-500 hover:bg-violet-600 text-white font-semibold shadow-md"
              >
                {isLoading ? "Cadastrando..." : "Cadastrar Curso"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
} 