import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  donationData: {
    nome: string;
    valor: string;
    cursoId: string;
  };
}

export function PaymentModal({ isOpen, onClose, donationData }: PaymentModalProps) {
  const [copied, setCopied] = useState(false);
  const pixCode = "00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540599.905802BR5915STUDYLOVERS6008BRASILIA62070503***6304E2CA";

  const handleCopyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white">
            Pagamento via PIX
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* QR Code */}
          <div className="flex justify-center">
            <div className="relative w-48 h-48 bg-white p-2 rounded-lg">
              <Image
                src="/qr-code-mock.png"
                alt="QR Code PIX"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Informações do pagamento */}
          <div className="space-y-2">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              <p>Valor: R$ {parseFloat(donationData.valor).toFixed(2)}</p>
              <p>Beneficiário: StudyLovers</p>
            </div>

            {/* Código PIX */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Código PIX Copia e Cola
              </label>
              <div className="flex gap-2">
                <div className="flex-1 p-2 bg-zinc-100 dark:bg-zinc-800 rounded text-sm text-zinc-600 dark:text-zinc-400 break-all">
                  {pixCode}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyPixCode}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Instruções */}
          <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-2">
            <p className="font-medium">Instruções:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Abra o aplicativo do seu banco</li>
              <li>Escolha pagar com PIX</li>
              <li>Escaneie o QR Code ou cole o código PIX</li>
              <li>Confirme as informações e finalize o pagamento</li>
            </ol>
          </div>

          {/* Botão de fechar */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-violet-500 text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 