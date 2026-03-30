import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Sociolume Admin',
    default: 'Sociolume Admin',
  },
  description: 'Sociolume Admin Portal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" data-theme="light">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
