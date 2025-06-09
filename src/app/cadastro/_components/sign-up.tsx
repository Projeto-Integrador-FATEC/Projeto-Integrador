"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function SignUp() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      alert("As senhas não coincidem!")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar usuário");
      }

      router.push("/login")
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error)
      alert(error.message || "Erro ao criar usuário. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      action={handleSubmit}
      className="w-full flex flex-col gap-4"
    >
      <label className="flex flex-col gap-2 text-zinc-900 dark:text-zinc-100">
        Nome completo
        <Input 
          name="name" 
          type="text" 
          required
          className="bg-cyan-200 dark:bg-zinc-800 shadow-md focus:ring-2 focus:ring-violet-400 dark:text-zinc-100"
        />
      </label>
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
      <label className="flex flex-col gap-2 text-zinc-900 dark:text-zinc-100">
        Confirmar senha
        <Input 
          name="confirmPassword" 
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
        {isLoading ? "Cadastrando..." : "Cadastrar"}
      </Button>
    </form>
  )
} 