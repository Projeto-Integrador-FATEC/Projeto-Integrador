import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  onRatingSubmit: (rating: number) => void;
}

export function RatingModal({ isOpen, onClose, courseId, onRatingSubmit }: RatingModalProps) {
  const session = useSession();
  const [rating, setRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log("session", session);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Por favor, selecione uma avaliação");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulando um delay para parecer uma requisição real
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Avaliação enviada com sucesso!");
      onRatingSubmit(rating);
      onClose();
    } catch (error) {
      toast.error("Erro ao enviar avaliação");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-zinc-900 dark:text-white">
            Avaliar Curso
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
              <button
                key={value}
                onClick={() => setRating(value)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold transition-colors
                  ${rating >= value 
                    ? "bg-violet-500 text-white" 
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-violet-100 dark:hover:bg-violet-900"
                  }`}
              >
                {value}
              </button>
            ))}
          </div>
          <div className="text-center text-zinc-600 dark:text-zinc-400 mb-6">
            {rating === 0 
              ? "Selecione uma nota de 1 a 10" 
              : `Você avaliou com nota ${rating}`
            }
          </div>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-violet-500 text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              className="bg-violet-500 hover:bg-violet-600 text-white font-semibold"
            >
              {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 