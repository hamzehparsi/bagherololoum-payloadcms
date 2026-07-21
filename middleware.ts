import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { DONOR_TOKEN_COOKIE } from '@/lib/auth-cookie'
import { getSafeNextPath } from '@/lib/safe-redirect'

const PUBLIC_PATHS = ['/', '/auth', '/donate']
const PROTECTED_PREFIXES = ['/profile', '/donate/confirm', '/donate/payment']

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  const token = request.cookies.get(DONOR_TOKEN_COOKIE)?.value

  if (token && pathname.startsWith('/auth')) {
    const next = getSafeNextPath(request.nextUrl.searchParams.get('next'))
    return NextResponse.redirect(new URL(next || '/', request.url))
  }

  if (!token && isProtectedPath(pathname)) {
    const loginUrl = new URL('/auth', request.url)
    if (pathname.startsWith('/donate/')) {
      loginUrl.searchParams.set('next', pathname)
    }
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
