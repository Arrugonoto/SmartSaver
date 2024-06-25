import { NextResponse } from 'next/server';
import { NextApiResponse } from 'next';
import { createUser } from '@lib/actions/user/create-user';

export async function POST(req: Request, res: NextApiResponse) {
  try {
    const formData = await req.json();
    // validate email and password - Zod will be used here

    const res = await createUser(formData);
    if (!res?.error)
      return NextResponse.json(
        { message: 'Account created succesfully' },
        { status: 200 }
      );
    return NextResponse.json({ message: res.message }, { status: 500 });
  } catch (error) {
    console.error('Sign-up error:', error);
    return NextResponse.json(
      {
        error: error,
        message: `Couldn't create account now. Try again later.`,
      },
      { status: 500 }
    );
  }
}
