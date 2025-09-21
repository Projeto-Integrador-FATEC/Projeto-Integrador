"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BackButton } from "@/components/ui/back-button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PaymentModal } from "@/components/payment-modal";

interface Course {
  id: number;
  nome: string;
  descricao: string;
  cargaHoraria: number;
  nivel: string;
  imagem: string;
}

export default function DoacaoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [donationData, setDonationData] = useState<{
    nome: string;
    valor: string;
    cursoId: string;
  } | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses");
        if (!response.ok) {
          throw new Error("Erro ao carregar cursos");
        }
        const data = await response.json();
        console.log(data);
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Erro ao carregar cursos");
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        nome: formData.get("nome") as string,
        email: formData.get("email") as string,
        valor: formData.get("valor") as string,
        cursoId: formData.get("cursoId") as string,
        mensagem: formData.get("mensagem") as string,
      };

      // Validar dados
      if (!data.nome || !data.email || !data.valor || !data.cursoId) {
        throw new Error("Todos os campos obrigatórios devem ser preenchidos");
      }

      // Abrir modal de pagamento
      setDonationData({
        nome: data.nome,
        valor: data.valor,
        cursoId: data.cursoId,
      });
      setIsPaymentModalOpen(true);
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Erro ao processar a doação");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-zinc-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <BackButton className="mb-4" />
        {/* Cabeçalho */}
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Fazer uma Doação</h1>
        </div>

        <Card className="p-6 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações pessoais */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Informações Pessoais</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Nome Completo *
                  </label>
                  <Input
                    name="nome"
                    required
                    placeholder="Seu nome completo" 
                    className="shadow-md focus:ring-2 focus:ring-violet-400 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    E-mail *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    required
                    placeholder="seu@email.com" 
                    className="shadow-md focus:ring-2 focus:ring-violet-400 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Informações da doação */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Informações da Doação</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Valor da Doação (R$) *
                  </label>
                  <Input
                    name="valor"
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    placeholder="0.00" 
                    className="shadow-md focus:ring-2 focus:ring-violet-400 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Curso *
                  </label>
                  <select 
                    name="cursoId"
                    required
                    disabled={isLoadingCourses}
                    className="w-full h-9 rounded-md border border-input px-3 py-1 text-sm shadow-sm focus:ring-2 focus:ring-violet-400 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  >
                    <option value="">Selecione o curso</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.nome}
                      </option>
                    ))}
                  </select>
                  {isLoadingCourses && (
                    <p className="text-sm text-zinc-500 mt-1">Carregando cursos...</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Mensagem (opcional)
                </label>
                <textarea
                  name="mensagem"
                  placeholder="Deixe uma mensagem para a instituição..."
                  className="w-full h-24 rounded-md border border-input px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-violet-400 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                />
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
                disabled={isLoading || isLoadingCourses}
                className="flex-1 bg-violet-500 hover:bg-violet-600 text-white font-semibold shadow-md"
              >
                {isLoading ? "Processando..." : "Confirmar Doação"}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Modal de Pagamento */}
      {donationData && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          donationData={donationData}
        />
      )}
    </div>
  );
} 