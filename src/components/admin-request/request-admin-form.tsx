"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AdminRequest } from "@/models/admin-request.model";
import { AdminRequestStatusBadge } from "./admin-request-status-badge";

export function RequestAdminForm() {
  const router = useRouter();
  const [justificativa, setJustificativa] = useState("");
  const [mine, setMine] = useState<AdminRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/solicitacoes-admin/minha")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Erro ao carregar chamado");
        }

        return response.json();
      })
      .then(setMine)
      .catch(() => toast.error("Erro ao carregar chamado"))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/solicitacoes-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ justificativa }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error ?? "Erro ao abrir chamado");
      }

      toast.success("Chamado enviado. Aguarde a análise de um administrador.");
      setMine(data);
      setJustificativa("");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao abrir chamado");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <p className="p-8">Carregando...</p>;
  }

  if (mine?.status === "PENDENTE") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            Chamado aberto
            <AdminRequestStatusBadge status={mine.status} />
          </CardTitle>
          <CardDescription>
            Sua solicitação já está na fila. Outros administradores vão analisar o pedido.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">Justificativa enviada</p>
          <p className="whitespace-pre-wrap text-sm">{mine.justificativa}</p>
        </CardContent>
      </Card>
    );
  }

  if (mine?.status === "APROVADA") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            Você já é administrador
            <AdminRequestStatusBadge status={mine.status} />
          </CardTitle>
          <CardDescription>
            Seu chamado foi aceito. Atualize a página se o acesso a cadastrar cursos ainda não aparecer.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitar perfil de administrador</CardTitle>
        <CardDescription>
          Explique por que você precisa cadastrar cursos. Um administrador vai aceitar ou recusar o
          chamado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mine?.status === "RECUSADA" && (
          <p className="mb-4 text-sm text-destructive">
            Seu chamado anterior foi recusado. Você pode enviar um novo pedido com mais detalhes.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            required
            minLength={20}
            maxLength={1000}
            value={justificativa}
            onChange={(event) => setJustificativa(event.target.value)}
            placeholder="Ex.: represento uma instituição e preciso publicar cursos gratuitos na plataforma..."
            className="min-h-[140px]"
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="bg-violet-500 hover:bg-violet-600">
              {isSubmitting ? "Enviando..." : "Abrir chamado"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
