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
import { z } from 'zod';

async function getUser(email: string): Promise<User | undefined> {
   try {
      const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
      return user.rows[0];
   } catch (error) {
      console.error(
         `Failed to fetch user, user with taht email address doesn't exist`,
         error
      );
      throw new Error(`User with that email address doesn't exists.`);
   }
}

export const authConfig = {
   pages: {
      signIn: '/login',
      signOut: '/',
   },
   //Next-auth Log-in functionality - not register
   providers: [
      CredentialsProvider({
         credentials: {
            email: {},
            password: {},
         },
         async authorize(credentials, req) {
            const parsedCredentials = z
               .object({
                  email: z.string().email({ message: 'Invalid email address' }),
                  password: z.string().min(10, {
                     message: 'Password must be at least 10 characters long',
                  }),
               })
               .safeParse(credentials);

            if (parsedCredentials.success) {
               const { email, password } = parsedCredentials.data;
               const user = await getUser(email);

               if (!user) return null;
               const passwordsMatch = await compare(password, user.password);
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
