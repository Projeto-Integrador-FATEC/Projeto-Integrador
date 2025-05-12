import { auth } from "../auth"
 
export default auth((req: any) => {
  if (!req.auth && req.nextUrl.pathname !== "/login") {
    const newUrl = new URL("/login", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})

export const config = {
    matcher: [
        // "/app/(app)/arquivos/:path*",
        "/((?!api|_next/static|_next/image|favicon.ico|billing|login|$).*)",
    ]
}