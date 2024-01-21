import { NextResponse } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { createUser } from '@/lib/actions/create-user';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
   try {
      const { name, email, password } = await req.body;
      // validate email and password - Zod will be used here
      console.log(name, email, password);

      return NextResponse.json(
         { message: 'Account created succesfully' },
         { status: 200 }
      );
   } catch (e) {
      console.error('Sign-up error:', e);
      return NextResponse.json(
         { error: e, message: 'Internal Server Error. Registration failed.' },
         { status: 500 }
      );
   }
}
