import { auth } from "../auth"
 
export default auth((req: any) => {
  // Se o usuário estiver logado e tentar acessar login ou cadastro, redireciona para home
  if (req.auth && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/cadastro")) {
    const newUrl = new URL("/", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }

  // Se o usuário não estiver logado e tentar acessar rotas protegidas, redireciona para login
  if (!req.auth && req.nextUrl.pathname !== "/login" && req.nextUrl.pathname !== "/cadastro") {
    const newUrl = new URL("/login", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})

export const config = {
    matcher: [
        // Protege todas as rotas exceto as rotas do sistema
        "/((?!api|_next/static|_next/image|favicon.ico|login_img.png|logo_img.svg).*)",
    ]
}