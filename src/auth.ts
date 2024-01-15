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
import { compare } from 'bcrypt';
import { z } from 'zod';
import { getUser } from './lib/actions';

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
                  email: z.string().email(),
                  password: z.string(),
               })
               .safeParse(credentials);

            if (parsedCredentials.success) {
               const { email, password } = parsedCredentials.data;
               const user = await getUser(email);

               if (!user) return null;
               const passwordsMatch = await compare(password, user.password);
               if (passwordsMatch) {
                  return user;
               } else {
                  throw new Error(`Invalid password`);
               }
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
