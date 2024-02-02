import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/header/Header';
import { getServerSession } from 'next-auth';
import SessionProvider from './SessionProvider';
import { authOptions } from './api/auth/[...nextauth]/options';
import { SideMenu } from '@/components/menus/side-menu/SideMenu';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
   title: {
      template: '%s | SmartSaver - spend less, save more',
      default: 'SmartSaver - spend less, save more',
   },
   description:
      'Finance tracking web app - by controlling spendings, increase Your savings',
};

export default async function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const session = await getServerSession(authOptions);

   return (
      <html lang="en" className="dark">
         <body className={inter.className}>
            <SessionProvider>
               <Header />
               <Providers>
                  <div className="flex w-full">
                     {session && <SideMenu />}
                     {children}
                  </div>
               </Providers>
            </SessionProvider>
         </body>
      </html>
   );
}
