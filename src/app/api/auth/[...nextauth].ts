import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import { authConfig } from '@/auth';

export const authOptions: NextAuthOptions = {
   ...authConfig,
   secret: process.env.NEXTAUTH_SECRET as string,
};

export default NextAuth(authOptions);
