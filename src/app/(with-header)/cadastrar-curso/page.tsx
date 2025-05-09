import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function CadastrarCursoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-violet-500 hover:text-violet-600">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold text-zinc-900">Cadastrar Novo Curso</h1>
        </div>

        <Card className="p-6">
          <form className="space-y-6">
            {/* Informações básicas */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Informações Básicas</h2>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Nome do Curso *
                </label>
                <Input 
                  placeholder="Ex: Curso de Informática Básica" 
                  className="shadow-md focus:ring-2 focus:ring-violet-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Descrição *
                </label>
                <Textarea 
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
                    type="number" 
                    placeholder="Ex: 40" 
                    className="shadow-md focus:ring-2 focus:ring-violet-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Nível do Curso *
                  </label>
                  <select className="w-full h-9 rounded-md border border-input px-3 py-1 text-sm shadow-sm focus:ring-2 focus:ring-violet-400">
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
              <h2 className="text-xl font-semibold">Imagem do Curso</h2>
              
              <div className="border-2 border-dashed border-violet-200 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="w-12 h-12 text-violet-500" />
                  <div className="text-zinc-600">
                    <p className="font-medium">Arraste uma imagem ou clique para selecionar</p>
                    <p className="text-sm">PNG, JPG até 5MB</p>
                  </div>
                  <Button variant="outline" className="mt-2 border-violet-500 text-violet-500 hover:bg-violet-50">
                    <Upload className="w-4 h-4 mr-2" />
                    Selecionar Imagem
                  </Button>
                </div>
              </div>
            </div>

            {/* Conteúdo do curso */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Conteúdo do Curso</h2>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Módulos e Aulas *
                </label>
                <div className="space-y-4">
                  <div className="p-4 border border-violet-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Módulo 1: Introdução</h3>
                      <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        Remover
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-zinc-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                        Aula 1: Apresentação do Curso
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                        Aula 2: Configuração do Ambiente
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full border-violet-500 text-violet-500 hover:bg-violet-50">
                    + Adicionar Módulo
                  </Button>
                </div>
              </div>
            </div>

            {/* Requisitos */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Requisitos</h2>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Pré-requisitos
                </label>
                <Textarea 
                  placeholder="Liste os conhecimentos ou habilidades necessárias para realizar o curso..." 
                  className="shadow-md focus:ring-2 focus:ring-violet-400 min-h-[100px]"
                />
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex gap-4 pt-4">
              <Button variant="outline" className="flex-1 border-violet-500 text-violet-500 hover:bg-violet-50">
                Cancelar
              </Button>
              <Button className="flex-1 bg-violet-500 hover:bg-violet-600 text-white font-semibold shadow-md">
                Cadastrar Curso
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
} 