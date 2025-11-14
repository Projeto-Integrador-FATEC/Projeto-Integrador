"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function SignIn() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Credenciais inválidas")
      }

      const data = await response.json()

      if (data.error) {
        toast.error("Erro ao fazer login", {
          description: "Email ou senha inválidos",
        })
        return
      }

      // Sucesso no login - forçar recarregamento completo para atualizar a sessão
      toast.success("Login realizado com sucesso!")
      window.location.href = "/"
    } catch (error) {
      toast.error("Erro ao fazer login", {
        description: "Email ou senha inválidos",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-4"
    >
      <label className="flex flex-col gap-2 text-zinc-900 dark:text-zinc-100">
        Email
        <Input 
          name="email" 
          type="email" 
          required
          className="bg-cyan-200 dark:bg-zinc-800 shadow-md focus:ring-2 focus:ring-violet-400 dark:text-zinc-100"
        />
      </label>
      <label className="flex flex-col gap-2 text-zinc-900 dark:text-zinc-100">
        Senha
        <Input 
          name="password" 
          type="password" 
          required
          className="bg-cyan-200 dark:bg-zinc-800 shadow-md focus:ring-2 focus:ring-violet-400 dark:text-zinc-100"
        />
      </label>
      <Button 
        type="submit" 
        disabled={isLoading}
        className="bg-violet-500 hover:bg-violet-600 text-white font-semibold shadow-md mt-2"
      >
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  )
}