"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminRequest } from "@/models/admin-request.model";
import { AdminRequestStatusBadge } from "./admin-request-status-badge";

function formatDate(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function AdminRequestQueue() {
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = async () => {
    const response = await fetch("/api/solicitacoes-admin");
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.error ?? "Erro ao carregar chamados");
    }

    setRequests(data);
  };

  useEffect(() => {
    load()
      .catch((error) => toast.error(error instanceof Error ? error.message : "Erro ao carregar chamados"))
      .finally(() => setIsLoading(false));
  }, []);

  const review = async (id: number, status: "APROVADA" | "RECUSADA") => {
    setBusyId(id);

    try {
      const response = await fetch(`/api/solicitacoes-admin/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error ?? "Erro ao analisar chamado");
      }

      toast.success(status === "APROVADA" ? "Chamado aprovado" : "Chamado recusado");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao analisar chamado");
    } finally {
      setBusyId(null);
    }
  };

  if (isLoading) {
    return <p className="p-8">Carregando...</p>;
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nenhum chamado</CardTitle>
          <CardDescription>Quando um aluno solicitar o perfil de administrador, o pedido aparece aqui.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardHeader>
            <CardTitle className="flex flex-wrap items-center gap-3 text-lg">
              {request.userName}
              <AdminRequestStatusBadge status={request.status} />
            </CardTitle>
            <CardDescription>
              {request.userEmail} · aberto em {formatDate(request.createdAt)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="whitespace-pre-wrap text-sm">{request.justificativa}</p>

            {request.status === "PENDENTE" && (
              <div className="flex gap-2">
                <Button
                  disabled={busyId === request.id}
                  className="bg-violet-500 hover:bg-violet-600"
                  onClick={() => review(request.id, "APROVADA")}
                >
                  Aceitar
                </Button>
                <Button
                  variant="outline"
                  disabled={busyId === request.id}
                  onClick={() => review(request.id, "RECUSADA")}
                >
                  Recusar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
