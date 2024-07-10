export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/expenses/:path*',
    '/assistant/:path*',
    '/notes/:path*',
    '/calendar/:path*',
  ],
};
