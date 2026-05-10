import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClientLayout } from '@/components/layout/ClientLayout';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lyrics Library',
  description: 'Your personal lyrics collection',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}