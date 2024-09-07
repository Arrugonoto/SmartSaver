import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@components/header/Header';
import { getServerSession } from 'next-auth';
import SessionProvider from './SessionProvider';
import { authOptions } from './api/auth/[...nextauth]/options';
import { SideMenu } from '@components/menus/side-menu';
import { ToastContainer, Slide, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex w-full">
          <SessionProvider>
            <Providers>
              <Header />
              <ToastContainer
                position="top-center"
                autoClose={5000}
                stacked
                transition={Zoom}
                hideProgressBar={true}
              />
              <div className="flex w-full h-full overflow-y-scroll">
                {session && <SideMenu />}
                {children}
              </div>
            </Providers>
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
