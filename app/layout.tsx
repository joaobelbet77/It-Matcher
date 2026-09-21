import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

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
    <html lang="pt-BR" className={`h-full ${plusJakartaSans.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-[#f8fafc] dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 antialiased font-sans selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
