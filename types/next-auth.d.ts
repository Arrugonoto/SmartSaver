import NextAuth from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface JWT extends DefaultJWT {
    id: string;
    with_credentials?: boolean;
  }

  interface User extends DefaultUser {
    with_credentials?: boolean;
  }

  interface Session {
    user: {
      /** The user's postal address. */
      id: string;
      with_credentials?: boolean;
    } & DefaultSession['user'];
  }
}
