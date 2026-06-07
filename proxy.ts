import { withAuth } from 'next-auth/middleware'

/**
 * NextAuth middleware — protects all /dashboard and /api/dashboard routes.
 * Unauthenticated requests are redirected to /login (configured in authOptions.pages).
 */
export default withAuth({
  pages: {
    signIn: '/login',
  },
})

export const config = {
  matcher: ['/dashboard/:path*', '/api/dashboard/:path*'],
}
