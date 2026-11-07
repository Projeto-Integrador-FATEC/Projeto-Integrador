import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

const PUBLIC_PAGES = ["/login", "/cadastro"]
const OPEN_PAGES = ["/email-verificado"]

export default function middleware(req: NextRequest) {
  if (OPEN_PAGES.includes(req.nextUrl.pathname)) {
    return NextResponse.next()
  }

  const hasSession = Boolean(getSessionCookie(req))
  const isPublicPage = PUBLIC_PAGES.includes(req.nextUrl.pathname)

  // Se o usuário estiver logado e tentar acessar login ou cadastro, redireciona para home
  if (hasSession && isPublicPage) {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin))
  }

  // Se o usuário não estiver logado e tentar acessar rotas protegidas, redireciona para login
  if (!hasSession && !isPublicPage) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin))
  }

  return NextResponse.next()
}

export const config = {
    matcher: [
        // Protege todas as rotas exceto as rotas do sistema
        "/((?!api|imagens|_next/static|_next/image|favicon.ico|login_img.png|logo_img.svg).*)",
    ]
}
