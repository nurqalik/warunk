import type { User } from "@prisma/client";
import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: (param) => {
      const { token } = param
      if(token) {
        // eslint-disable-next-line no-unused-vars
        const user = token.user as User
        return true
      }
      return false
    }
  }
})

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/dashboard/:path*',
}