'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { MobileMenuContextProvider } from '@context/MobileMenuContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider className="flex flex-col w-full h-[100vh] overflow-y-hidden">
      <MobileMenuContextProvider>
        <NextThemesProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
        >
          {children}
        </NextThemesProvider>
      </MobileMenuContextProvider>
    </NextUIProvider>
  );
}
