import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/layout/Toast';
import { AuthProvider } from '@/components/auth/AuthContext';
import { ThemeProvider } from '@/components/layout/ThemeContext';
import { AppLayoutContent } from '@/components/layout/AppLayoutContent';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ItMatcher Enterprise | Recrutamento Inteligente & Match de Competências',
  description: 'Plataforma corporativa de compatibilidade técnica e recrutamento inteligente em tecnologia.',
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className={`${inter.className} min-h-screen bg-[#f8fafc] dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 antialiased font-sans selection:bg-blue-600 selection:text-white`}>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <AppLayoutContent>{children}</AppLayoutContent>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>

    </html>
  );
}
