import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import { authConfig } from '@/auth';

export const authOptions: NextAuthOptions = {
   ...authConfig,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
export default NextAuth(authOptions);
