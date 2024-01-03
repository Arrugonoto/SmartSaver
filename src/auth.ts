import type {
   GetServerSidePropsContext,
   NextApiRequest,
   NextApiResponse,
} from 'next';
import type { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { sql } from '@vercel/postgres';
import type { User } from '@/lib/definitions';
import { compare } from 'bcrypt';

async function getUser(email: string): Promise<User | undefined> {
   try {
      const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
      return user.rows[0];
   } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error(`User with that email address doesn't exists.`);
   }
}

export const authConfig = {
   pages: {
      signIn: '/login',
      signOut: '/',
   },
   providers: [
      CredentialsProvider({
         credentials: {
            username: {},
            email: {},
            password: {},
         },
         async authorize(credentials, req) {
            let user;

            if (credentials) {
               user = await getUser(credentials.email);

               if (!user) return null;
               const passwordsMatch = await compare(
                  credentials?.password,
                  user.password
               );
               if (passwordsMatch) return user;
            }

            return null;
         },
      }),
      GitHubProvider({
         clientId: process.env.GITHUB_ID as string,
         clientSecret: process.env.GITHUB_SECRET as string,
      }),
      GoogleProvider({
         clientId: process.env.GOOGLE_ID as string,
         clientSecret: process.env.GOOGLE_SECRET as string,
      }),
   ], // rest of config
} satisfies NextAuthOptions;

export function auth(
   ...args:
      | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
      | [NextApiRequest, NextApiResponse]
      | []
) {
   return getServerSession(...args, authConfig);
}
