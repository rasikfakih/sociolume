import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Sociolume',
    default: 'Sociolume - Social Volume Management Platform',
  },
  description: 'SaaS platform for managing social media volume and analytics.',
  keywords: ['social media', 'analytics', 'volume', 'marketing'],
  openGraph: {
    title: 'Sociolume',
    description: 'Social Volume Management Platform',
    type: 'website',
  },
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
