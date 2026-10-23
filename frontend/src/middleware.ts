import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user
  const permissions = req.auth?.user?.permissions
  const isAdmin = !!permissions?.includes('admin')
  const pathname = req.nextUrl.pathname

  // Evita loop: /auth/sign-in ↔ / (a home só redireciona para o login)
  if (pathname === '/auth/sign-in') {
    if (isLoggedIn && isAdmin) {
      return NextResponse.redirect(new URL('/admin', req.nextUrl))
    }

    if (isLoggedIn && !isAdmin) {
      return NextResponse.redirect(new URL('/auth/sign-out', req.nextUrl))
    }

    return NextResponse.next()
  }

  if (pathname.startsWith('/admin') && (!isLoggedIn || !isAdmin)) {
    return NextResponse.redirect(new URL('/auth/sign-in', req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
