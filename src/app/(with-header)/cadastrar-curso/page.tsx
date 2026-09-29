"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CadastrarCursoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [imagemPreview, setImagemPreview] = useState<string | null>(null);

  if (status === "loading") {
    return <p className="p-8">Carregando...</p>;
  }

  if (session?.user?.role !== "ADMIN") {
    router.push("/");
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const curso = {
      nome: form.get("nome"),
      descricao: form.get("descricao"),
      cargaHoraria: Number(form.get("cargaHoraria")),
      nivel: form.get("nivel"),
      provider: form.get("provider"),
      url: form.get("url"),
    };

    const imagem = form.get("imagem");

    const formData = new FormData();

    formData.append(
      "curso",
      new Blob([JSON.stringify(curso)], {
        type: "application/json",
      })
    );

    if (imagem instanceof File && imagem.size > 0) {
      formData.append("imagem", imagem);
    }

    try {
      const response = await fetch("http://localhost:4080/api/cursos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        console.error("Erro ao cadastrar curso:", response.status);
        alert("Erro ao cadastrar curso.");
        return;
      }

      alert("Curso cadastrado com sucesso!");

      router.push("/cursos");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o servidor.");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">

        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="text-violet-500 hover:text-violet-600"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>

          <h1 className="text-3xl font-bold text-zinc-900">
            Cadastrar Novo Curso
          </h1>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                Informações Básicas
              </h2>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Nome do Curso *
                </label>

                <Input
                  name="nome"
                  required
                  placeholder="Ex: Curso de Informática Básica"
                  className="shadow-md focus:ring-2 focus:ring-violet-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Descrição *
                </label>

                <Textarea
                  name="descricao"
                  required
                  placeholder="Descreva o conteúdo e objetivos do curso..."
                  className="shadow-md focus:ring-2 focus:ring-violet-400 min-h-[120px]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Carga Horária (horas) *
                  </label>

                  <Input
                    name="cargaHoraria"
                    type="number"
                    min="1"
                    required
                    placeholder="Ex: 40"
                    className="shadow-md focus:ring-2 focus:ring-violet-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Nível do Curso *
                  </label>

                  <select
                    name="nivel"
                    required
                    className="w-full h-9 rounded-md border border-input px-3 py-1 text-sm shadow-sm focus:ring-2 focus:ring-violet-400"
                  >
                    <option value="">Selecione o nível</option>
                    <option value="iniciante">Iniciante</option>
                    <option value="intermediario">Intermediário</option>
                    <option value="avancado">Avançado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Plataforma / Provedor *
                  </label>

                  <Input
                    name="provider"
                    required
                    placeholder="Ex: Fundação Bradesco"
                    className="shadow-md focus:ring-2 focus:ring-violet-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Link do Curso *
                  </label>

                  <Input
                    name="url"
                    type="url"
                    required
                    placeholder="https://..."
                    className="shadow-md focus:ring-2 focus:ring-violet-400"
                  />
                </div>

              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                Imagem do Curso
              </h2>

              <div className="border-2 border-dashed border-violet-200 rounded-lg p-6 text-center">
                <div className="flex flex-col items-center gap-3">

                  {imagemPreview ? (
                    <img
                      src={imagemPreview}
                      alt="Prévia da imagem do curso"
                      className="w-full max-w-md h-[220px] object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <ImageIcon className="w-12 h-12 text-violet-500" />

                      <div className="text-zinc-600">
                        <p className="font-medium">
                          Selecione uma imagem para o curso
                        </p>

                        <p className="text-sm">
                          PNG, JPG ou WEBP até 5MB
                        </p>
                      </div>
                    </>
                  )}

                  <label className="mt-2 inline-flex items-center justify-center rounded-md border border-violet-500 px-4 py-2 text-sm font-medium text-violet-500 hover:bg-violet-50 cursor-pointer">

                    <Upload className="w-4 h-4 mr-2" />

                    {imagemPreview
                      ? "Trocar Imagem"
                      : "Selecionar Imagem"}

                    <input
                      name="imagem"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(event) => {
                        const arquivo = event.target.files?.[0];

                        if (!arquivo) {
                          return;
                        }

                        if (arquivo.size > 5 * 1024 * 1024) {
                          alert("A imagem deve ter no máximo 5MB.");
                          event.target.value = "";
                          setImagemPreview(null);
                          return;
                        }

                        const url = URL.createObjectURL(arquivo);

                        setImagemPreview(url);
                      }}
                    />

                  </label>

                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                Requisitos
              </h2>

              <Textarea
                placeholder="Liste os conhecimentos ou habilidades necessárias para realizar o curso..."
                className="shadow-md focus:ring-2 focus:ring-violet-400 min-h-[100px]"
              />
            </div>

            <div className="flex gap-4 pt-4">

              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/")}
                className="flex-1 border-violet-500 text-violet-500 hover:bg-violet-50"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                className="flex-1 bg-violet-500 hover:bg-violet-600 text-white font-semibold shadow-md"
              >
                Cadastrar Curso
              </Button>

            </div>

          </form>
        </Card>
      </div>
    </div>
  );
}