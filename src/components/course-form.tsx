"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Image as ImageIcon, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Category } from "@/models/category.model";
import { Course } from "@/models/course.model";

interface CourseFormProps {
  mode: "create" | "edit";
  course?: Course;
}

const LEVELS = [
  { value: "iniciante", label: "Iniciante" },
  { value: "intermediario", label: "Intermediário" },
  { value: "avancado", label: "Avançado" },
] as const;

function normalizeLevel(nivel?: string) {
  const folded = nivel
    ?.normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();

  return LEVELS.some((level) => level.value === folded) ? folded : "";
}

export function CourseForm({ mode, course }: CourseFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string | null>(
    course?.imagemPath ? `/imagens/${course.imagemPath}` : null
  );
  const [selectedCategory, setSelectedCategory] = useState(
    course?.categoria_id ? String(course.categoria_id) : ""
  );
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categorias")
      .then((response) => (response.ok ? response.json() : []))
      .then(setCategories)
      .catch(() => toast.error("Erro ao carregar categorias"));
  }, []);

  useEffect(() => {
    return () => {
      if (imagemPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagemPreview);
      }
    };
  }, [imagemPreview]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB.");
      event.target.value = "";
      return;
    }

    if (imagemPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagemPreview);
    }

    setSelectedImage(file);
    setImagemPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const form = new FormData(event.currentTarget);
      const curso = {
        nome: form.get("name"),
        descricao: form.get("description"),
        cargaHoraria: Number(form.get("workload")),
        nivel: form.get("level"),
        provider: form.get("provider"),
        url: form.get("url"),
      };

      const formData = new FormData();
      formData.append("curso", new Blob([JSON.stringify(curso)], { type: "application/json" }));

      if (selectedCategory && selectedCategory !== "none") {
        formData.append("categoria_id", selectedCategory);
      }

      if (selectedImage) {
        formData.append("imagem", selectedImage);
      }

      const url = mode === "edit" && course ? `/api/cursos/${course.id}` : "/api/cursos";
      const response = await fetch(url, {
        method: mode === "edit" ? "PUT" : "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.error ?? (mode === "edit" ? "Erro ao atualizar curso" : "Erro ao cadastrar curso")
        );
      }

      toast.success(mode === "edit" ? "Curso atualizado com sucesso!" : "Curso cadastrado com sucesso!");
      router.push(mode === "edit" && course ? `/curso-details/${course.id}` : "/cursos");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : mode === "edit"
            ? "Erro ao atualizar curso"
            : "Erro ao cadastrar curso"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <CourseFormFields
          course={course}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <CourseFormImage preview={imagemPreview} fileName={selectedImage?.name} onImageChange={handleImageChange} />
        <CardFooter className="flex gap-4 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading
              ? mode === "edit"
                ? "Salvando..."
                : "Cadastrando..."
              : mode === "edit"
                ? "Salvar alterações"
                : "Cadastrar Curso"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function CourseFormFields({
  course,
  categories,
  selectedCategory,
  onCategoryChange,
}: {
  course?: Course;
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}) {
  return (
    <>
      <CardHeader>
        <CardTitle>Informações Básicas</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Nome do Curso *</Label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={course?.nome}
            placeholder="Ex: Curso de Informática Básica"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Descrição *</Label>
          <Textarea
            id="description"
            name="description"
            required
            defaultValue={course?.descricao}
            placeholder="Descreva o conteúdo e objetivos do curso..."
            className="min-h-[120px]"
          />
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="workload">Carga Horária (horas) *</Label>
            <Input
              id="workload"
              name="workload"
              required
              type="number"
              defaultValue={course?.cargaHoraria}
              placeholder="Ex: 40"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="level">Nível do Curso *</Label>
            <select
              id="level"
              name="level"
              required
              defaultValue={normalizeLevel(course?.nivel)}
              className="border-input bg-background h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs"
            >
              <option value="">Selecione o nível</option>
              {LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Categoria</Label>
          <Select
            value={selectedCategory || "none"}
            onValueChange={(value) => onCategoryChange(value === "none" ? "" : value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a categoria (opcional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="none">Nenhuma categoria</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.nome}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="provider">Quem fornece o curso *</Label>
          <Input
            id="provider"
            name="provider"
            required
            defaultValue={course?.provider}
            placeholder="Ex: Universidade XYZ, Professor João Silva"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="url">URL do Curso *</Label>
          <Input
            id="url"
            name="url"
            required
            type="url"
            defaultValue={course?.url}
            placeholder="https://exemplo.com/curso"
          />
        </div>
      </CardContent>
    </>
  );
}

function CourseFormImage({
  preview,
  fileName,
  onImageChange,
}: {
  preview: string | null;
  fileName?: string;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <CardContent className="flex flex-col gap-4">
      <CardTitle>Imagem do Curso</CardTitle>
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-8 text-center">
          {preview ? (
            <img src={preview} alt="Prévia da imagem do curso" className="h-[220px] w-full max-w-md rounded-lg object-cover" />
          ) : (
            <>
              <ImageIcon />
              <p className="text-muted-foreground font-medium">Arraste uma imagem ou clique para selecionar</p>
              <p className="text-muted-foreground text-sm">PNG, JPG até 5MB</p>
            </>
          )}
          <input
            type="file"
            id="image"
            accept="image/png,image/jpeg,image/webp"
            onChange={onImageChange}
            className="hidden"
          />
          <Button type="button" variant="outline" className="mt-2" onClick={() => document.getElementById("image")?.click()}>
            <Upload data-icon="inline-start" />
            {preview ? "Trocar Imagem" : "Selecionar Imagem"}
          </Button>
          {fileName && <p className="text-muted-foreground text-sm">{fileName}</p>}
        </div>
    </CardContent>
  );
}
