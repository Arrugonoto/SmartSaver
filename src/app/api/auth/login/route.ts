import { NextApiRequest, NextApiResponse } from 'next';
import { signIn } from 'next-auth/react';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
   try {
      const { email, password } = await req.body;
      console.log(email, password);
      await signIn('credentials', {
         email: email,
         password: password,
      });

      res.status(200).json({ success: true });
   } catch (error) {
      console.error('Sign-in error:', error);
      res.status(500).json({ success: false, error: 'Sign-in failed' });
   }
}
