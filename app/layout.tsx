import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ItMatcher - Smart Recruiting & IT Matcher',
  description: 'Sistema inteligente de triagem ponderada de candidatos e correspondência de competências técnicas.',
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
      <body className="min-h-screen bg-slate-100 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
