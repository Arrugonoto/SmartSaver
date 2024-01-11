import { NextResponse } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { signIn } from 'next-auth/react';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
   try {
      const { email, password } = await req.body;
      // insert credentials validation here - zod c:
      console.log(email, password);
      await signIn('credentials', {
         email: email,
         password: password,
         redirect: false,
      });

      return NextResponse.json(
         { message: 'Succesfully logged-in' },
         { status: 200 }
      );
   } catch (error) {
      console.error('Sign-in error:', error);
      return NextResponse.json(
         { error: error, message: 'Internal Server Error. Sign-in failed.' },
         { status: 500 }
      );
   }
}
