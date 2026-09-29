"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SignIn() {
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const email = formData.get("email")
    const password = formData.get("password")

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.ok) {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-4"
    >
      <label className="flex flex-col gap-2">
        Email
        <Input
          name="email"
          type="email"
          className="bg-cyan-200 shadow-md focus:ring-2 focus:ring-violet-400"
        />
      </label>

      <label className="flex flex-col gap-2">
        Password
        <Input
          name="password"
          type="password"
          className="bg-cyan-200 shadow-md focus:ring-2 focus:ring-violet-400"
        />
      </label>

      <Button
        type="submit"
        className="bg-violet-500 hover:bg-violet-600 text-white font-semibold shadow-md mt-2"
      >
        Entrar
      </Button>
    </form>
  )
}