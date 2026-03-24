'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { MobileMenuContextProvider } from '@context/MobileMenuContext';
import { AssistantChatContextProvider } from '@context/AsssistantChatContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider className="flex flex-col w-full h-[100vh] overflow-y-hidden">
      <MobileMenuContextProvider>
        <AssistantChatContextProvider>
          <NextThemesProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={true}
          >
            {children}
          </NextThemesProvider>
        </AssistantChatContextProvider>
      </MobileMenuContextProvider>
    </NextUIProvider>
  );
}
