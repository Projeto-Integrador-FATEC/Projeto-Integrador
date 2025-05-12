import { signIn } from "../../../../../../auth"
import { NextResponse } from "next/server"
import LoginService from "@/services/get-user-service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      )
    }

    const response = await LoginService(email, password)
    
    if (!response.data) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      )
    }

    // Set the session
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Erro no login:", error)
    return NextResponse.json(
      { error: "Erro ao fazer login" },
      { status: 500 }
    )
  }
} 