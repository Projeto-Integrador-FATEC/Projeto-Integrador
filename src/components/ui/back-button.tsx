"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  /**
   * Texto a ser exibido no botão. Default: "Voltar"
   */
  label?: string;
  
  /**
   * URL específica para redirecionar. Se não fornecida, usa router.back()
   */
  href?: string;
  
  /**
   * Classes CSS adicionais
   */
  className?: string;
  
  /**
   * Variante do botão
   */
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  
  /**
   * Tamanho do ícone
   */
  iconSize?: number;
  
  /**
   * Se deve mostrar apenas o ícone (sem texto)
   */
  iconOnly?: boolean;
}

export function BackButton({
  label = "Voltar",
  href,
  className,
  variant = "ghost",
  iconSize = 20,
  iconOnly = false
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  const buttonContent = (
    <>
      <ArrowLeft size={iconSize} className={iconOnly ? "" : "mr-2"} />
      {!iconOnly && label}
    </>
  );

  const buttonClasses = cn(
    "transition-colors",
    iconOnly ? "p-2" : "px-4 py-2",
    variant === "ghost" && "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white",
    className
  );

  // Se um href específico for fornecido, use Link para melhor SEO e navegação
  if (href) {
    return (
      <Link href={href}>
        <Button
          variant={variant}
          className={buttonClasses}
        >
          {buttonContent}
        </Button>
      </Link>
    );
  }

  // Caso contrário, use navegação programática
  return (
    <Button
      onClick={handleBack}
      variant={variant}
      className={buttonClasses}
    >
      {buttonContent}
    </Button>
  );
}

// Versão server-side que sempre usa Link
interface BackButtonServerProps extends Omit<BackButtonProps, 'href'> {
  /**
   * URL obrigatória para navegação server-side
   */
  href: string;
}

export function BackButtonServer({
  label = "Voltar",
  href,
  className,
  variant = "ghost",
  iconSize = 20,
  iconOnly = false
}: BackButtonServerProps) {
  const buttonContent = (
    <>
      <ArrowLeft size={iconSize} className={iconOnly ? "" : "mr-2"} />
      {!iconOnly && label}
    </>
  );

  const buttonClasses = cn(
    "transition-colors",
    iconOnly ? "p-2" : "px-4 py-2",
    variant === "ghost" && "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white",
    className
  );

  return (
    <Link href={href}>
      <Button
        variant={variant}
        className={buttonClasses}
      >
        {buttonContent}
      </Button>
    </Link>
  );
}
