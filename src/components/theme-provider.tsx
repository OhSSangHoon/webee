'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="webee-theme"
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

export { useTheme } from 'next-themes';
