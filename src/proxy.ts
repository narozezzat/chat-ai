import createMiddleware from 'next-intl/middleware'
import { routing } from './config/navigation'
import type { NextRequest } from 'next/server'

const handleRequest = createMiddleware(routing)

export function proxy(request: NextRequest) {
  return handleRequest(request)
}

export default proxy

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ar|en)/:path*'],
}
