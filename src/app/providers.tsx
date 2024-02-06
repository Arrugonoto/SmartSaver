'use client';

import { NextUIProvider } from '@nextui-org/react';

export function Providers({ children }: { children: React.ReactNode }) {
   return <NextUIProvider className="flex-1">{children}</NextUIProvider>;
}
