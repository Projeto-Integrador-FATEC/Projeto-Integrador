"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Clock, CalendarDays, FileText, MessageCircle, Send, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { CourseDetails } from "@/services/get-course-details-service";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import Link from "next/link";
import { RatingModal } from "@/components/rating-modal";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCourseComments, Comment } from "@/services/get-course-comments";

export default function CursoDetailsPage() {
  const params = useParams();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    async function loadCourseDetails() {
      try {
        const response = await fetch(`/api/courses/${params.id}`);
        if (!response.ok) {
          throw new Error("Erro ao carregar detalhes do curso");
        }
        const data = await response.json();
        setCourse(data);
        
        // Comentários de exemplo (em produção, viriam da API)
        setComments([
          {
            id: "1",
            author: "Maria Silva",
            content: "Excelente curso! Muito didático e bem estruturado. Aprendi muito sobre os conceitos fundamentais.",
            date: "2024-01-15",
            rating: 5
          },
          {
            id: "2", 
            author: "João Santos",
            content: "Curso muito bom, mas poderia ter mais exemplos práticos. No geral, recomendo!",
            date: "2024-01-10",
            rating: 4
          },
          {
            id: "3",
            author: "Ana Costa",
            content: "Adorei o curso! O instrutor explica de forma muito clara e os materiais são de ótima qualidade.",
            date: "2024-01-05",
            rating: 5
          }
        ]);
      } catch (error) {
        toast.error("Erro ao carregar detalhes do curso");
      } finally {
        setIsLoading(false);
      }
    }

    loadCourseDetails();
  }, [params.id]);

  const handleRatingSubmit = (newRating: number) => {
    if (course) {
      setCourse({
        ...course,
        avaliacao: newRating
      });
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      toast.error("Por favor, escreva um comentário");
      return;
    }

    setIsSubmittingComment(true);
    
    try {
      // Simular envio para API (em produção, seria uma chamada real)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const comment: Comment = {
        id: Date.now().toString(),
        author: "Usuário Atual", // Em produção, viria do contexto de autenticação
        content: newComment,
        date: new Date().toISOString().split('T')[0],
        rating: 5 // Poderia ser um campo separado
      };
      
      setComments(prev => [comment, ...prev]);
      setNewComment("");
      toast.success("Comentário adicionado com sucesso!");
    } catch (error) {
      toast.error("Erro ao adicionar comentário");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (isLoading) {
    return <div className="text-zinc-600 dark:text-zinc-400">Carregando...</div>;
  }

  if (!course) {
    return <div className="text-zinc-600 dark:text-zinc-400">Curso não encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-background dark:bg-zinc-900 flex flex-col mb-8">
      {/* Banner do curso */}
      <section className="w-full bg-cyan-100 dark:bg-cyan-900 py-12 px-4 flex flex-col md:flex-row items-start md:items-center justify-between relative">
        <div className="flex justify-between items-center w-full max-w-6xl mx-auto">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold text-zinc-900 dark:text-white mb-4">{course.nome}</h1>
          </div>

          <Card className="absolute md:static right-8 top-8 md:ml-8 w-[320px] shadow-lg p-6 flex flex-col gap-2 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <ThumbsUp className="w-5 h-5" /> Avaliação <span className="ml-auto font-semibold">{course.avaliacao || 10}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <Clock className="w-5 h-5" /> Carga Horária <span className="ml-auto font-semibold">{course.cargaHoraria}h</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <CalendarDays className="w-5 h-5" /> Última Atualização <span className="ml-auto font-semibold">{course.ultimaAtualizacao || "17/05/2025"}</span>
            </div>
          </Card>
        </div>
      </section>

      {/* Botões de ação */}
      <div className="flex justify-between items-center w-full max-w-6xl mx-auto mt-8 px-4">
        <div className="flex gap-4">
          <Button className="bg-violet-500 hover:bg-violet-600 text-white font-semibold shadow-md">
            <Link target="_blank" href={course.url}>Participar</Link>
          </Button>
          <Button 
            variant="outline" 
            className="border-violet-500 text-violet-500 dark:text-violet-400 font-semibold shadow-md"
            onClick={() => setIsRatingModalOpen(true)}
          >
            Adicionar avaliação
          </Button>
        </div>
        <Button className="bg-violet-500 hover:bg-violet-600 text-white font-semibold shadow-md">
          <Link href="/doacao">Realizar Doação</Link>
        </Button>
      </div>

      {/* Informações do curso */}
      <section className="max-w-6xl w-full mx-auto mt-12 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <div className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">Curso Oferecido Por</div>
            <span className="text-zinc-700 dark:text-zinc-300">{course.provider}</span>
          </div>
          <div className="text-right mt-6 md:mt-0">
            <div className="text-xl font-semibold text-zinc-900 dark:text-white">Total Arrecadado</div>
            <div className="text-lg font-bold text-zinc-700 dark:text-zinc-300">
              R${course.totalArrecadado?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || "0,00"}
            </div>
          </div>
        </div>
        
        <Card className="p-6 mt-24 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-2 mb-2 text-xl font-semibold text-zinc-900 dark:text-white">
            <FileText className="w-6 h-6" />Descrição
          </div>
          <div className="text-zinc-700 dark:text-zinc-300">
            {course.descricao}
          </div>
        </Card>

        {/* Seção de Comentários */}
        <Card className="p-6 mt-8 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-2 mb-6 text-xl font-semibold text-zinc-900 dark:text-white">
            <MessageCircle className="w-6 h-6" />
            Comentários ({comments.length})
          </div>

          {/* Formulário para novo comentário */}
          <div className="mb-8 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-white">Deixe seu comentário</h3>
            <Textarea
              placeholder="Compartilhe sua experiência com este curso..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-3 bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white"
              rows={4}
            />
            <Button
              onClick={handleCommentSubmit}
              disabled={isSubmittingComment || !newComment.trim()}
              className="bg-violet-500 hover:bg-violet-600 text-white font-semibold"
            >
              {isSubmittingComment ? (
                <>Enviando...</>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Comentário
                </>
              )}
            </Button>
          </div>

          {/* Lista de comentários */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
                Seja o primeiro a comentar sobre este curso!
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-4 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarImage src={comment.avatar} />
                    <AvatarFallback className="bg-violet-500 text-white">
                      {comment.author.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-zinc-900 dark:text-white">{comment.author}</h4>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < comment.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-zinc-300 dark:text-zinc-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">
                        {new Date(comment.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>

      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        courseId={params.id as string}
        onRatingSubmit={handleRatingSubmit}
      />
    </div>
  );
} 