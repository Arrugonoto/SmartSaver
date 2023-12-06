export { default } from 'next-auth/middleware';

export const config = { matcher: ['/dashboard/:path*'] };

// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
// import { NextApiRequest, NextApiResponse } from 'next';
// import { NextResponse } from 'next/server';

// export async function middleware(req: NextApiRequest, res: NextApiResponse) {
//    const session = await getServerSession(req, res, authOptions);

//    if (!session) {
//       console.log('session not found');
//       return NextResponse.redirect(new URL('/', req.url));
//    }

//    return NextResponse.next();
// }

// export const config = {
//    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
//    matcher: [
//       '/((?!/login|!api|_next/static|_next/image|.*\\.png$).*)',
//       'src/dashboard/:path*',
//    ],
// };
