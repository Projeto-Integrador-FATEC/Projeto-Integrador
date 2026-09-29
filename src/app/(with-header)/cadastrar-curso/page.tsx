"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { BackButton } from "@/components/ui/back-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategories } from "@/services/categories-service";

export default function CadastrarCursoPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const categories = getCategories();

  useEffect(() => {
    if (status !== "loading" && session?.user?.role !== "ADMIN") {
      router.replace("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    return () => {
      if (imagemPreview) {
        URL.revokeObjectURL(imagemPreview);
      }
    };
  }, [imagemPreview]);

  if (status === "loading") {
    return <p className="p-8">Carregando...</p>;
  }

  if (session?.user?.role !== "ADMIN") {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const form = new FormData(e.currentTarget);

      const curso = {
        nome: form.get("name"),
        descricao: form.get("description"),
        cargaHoraria: Number(form.get("workload")),
        nivel: form.get("level"),
        provider: form.get("provider"),
        url: form.get("url"),
      };

      const formData = new FormData();

      formData.append(
        "curso",
        new Blob([JSON.stringify(curso)], {
          type: "application/json",
        })
      );

      if (selectedCategory && selectedCategory !== "none") {
        formData.append("categoria_id", selectedCategory);
      }

      if (selectedImage) {
        formData.append("imagem", selectedImage);
      }

      const response = await fetch("http://localhost:4080/api/cursos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro ao cadastrar curso: ${response.status}`);
      }

      toast.success("Curso cadastrado com sucesso!");
      router.push("/cursos");
      router.refresh();
    } catch (error) {
      console.error("Error creating course:", error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao cadastrar curso");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB.");
      e.target.value = "";
      setSelectedImage(null);
      setImagemPreview(null);
      return;
    }

    if (imagemPreview) {
      URL.revokeObjectURL(imagemPreview);
    }

    setSelectedImage(file);
    setImagemPreview(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-background dark:bg-zinc-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <BackButton className="mb-4" />

        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Cadastrar Novo Curso
          </h1>
        </div>

        <Card className="p-6 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Informações Básicas
              </h2>

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
                    className="w-full h-9 rounded-md border px-3 py-1 text-sm shadow-sm focus:ring-2 focus:ring-violet-400 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  >
                    <option value="">Selecione o nível</option>
                    <option value="iniciante">Iniciante</option>
                    <option value="intermediario">Intermediário</option>
                    <option value="avancado">Avançado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Categoria
                </label>

                <Select
                  value={selectedCategory || undefined}
                  onValueChange={(value) =>
                    setSelectedCategory(value === "none" ? "" : value)
                  }
                >
                  <SelectTrigger className="w-full shadow-md focus:ring-2 focus:ring-violet-400 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white">
                    <SelectValue placeholder="Selecione a categoria (opcional)" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="none">Nenhuma categoria</SelectItem>

                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Quem fornece o curso *
                </label>

                <Input
                  name="provider"
                  required
                  placeholder="Ex: Universidade XYZ, Professor João Silva"
                  className="shadow-md focus:ring-2 focus:ring-violet-400 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  URL do Curso *
                </label>

                <Input
                  name="url"
                  required
                  type="url"
                  placeholder="https://exemplo.com/curso"
                  className="shadow-md focus:ring-2 focus:ring-violet-400 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Imagem do Curso
              </h2>

              <div className="border-2 border-dashed border-violet-200 dark:border-violet-800 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center gap-2">
                  {imagemPreview ? (
                    <img
                      src={imagemPreview}
                      alt="Prévia da imagem do curso"
                      className="w-full max-w-md h-[220px] object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <ImageIcon className="w-12 h-12 text-violet-500" />

                      <div className="text-zinc-600 dark:text-zinc-400">
                        <p className="font-medium">
                          Arraste uma imagem ou clique para selecionar
                        </p>
                        <p className="text-sm">PNG, JPG até 5MB</p>
                      </div>
                    </>
                  )}

                  <input
                    type="file"
                    id="image"
                    accept="image/png,image/jpeg,image/webp"
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
                    {imagemPreview ? "Trocar Imagem" : "Selecionar Imagem"}
                  </Button>

                  {selectedImage && (
                    <p className="text-sm text-violet-500 mt-2">
                      {selectedImage.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

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