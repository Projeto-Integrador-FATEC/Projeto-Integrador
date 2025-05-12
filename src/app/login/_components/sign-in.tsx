import { signIn } from "../../../../auth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
export function SignIn() {
  return (
    <form
      action={async (formData) => {
        "use server"
        await signIn("credentials", formData)
      }}
      className="w-full flex flex-col gap-4"
    >
      <label className="flex flex-col gap-2">
        Email
        <Input name="email" type="email" className="bg-cyan-200 shadow-md focus:ring-2 focus:ring-violet-400"/>
      </label>
      <label className="flex flex-col gap-2">
        Password
        <Input name="password" type="password" className="bg-cyan-200 shadow-md focus:ring-2 focus:ring-violet-400"/>
      </label>
      <Button type="submit" className="bg-violet-500 hover:bg-violet-600 text-white font-semibold shadow-md mt-2">Entrar</Button>
    </form>
  )
}