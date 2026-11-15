import { Badge } from "@/components/ui/badge";
import { AdminRequestStatus } from "@/models/admin-request.model";

const LABELS: Record<AdminRequestStatus, string> = {
  PENDENTE: "Em análise",
  APROVADA: "Aprovada",
  RECUSADA: "Recusada",
};

const VARIANTS: Record<AdminRequestStatus, "secondary" | "default" | "destructive"> = {
  PENDENTE: "secondary",
  APROVADA: "default",
  RECUSADA: "destructive",
};

export function AdminRequestStatusBadge({ status }: { status: AdminRequestStatus }) {
  return <Badge variant={VARIANTS[status]}>{LABELS[status]}</Badge>;
}
