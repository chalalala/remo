import './globals.css';
import type { Metadata } from 'next';
import { roboto } from './constants/typography';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'REMO',
  description: 'A simple resource manager',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={roboto.variable}>{children}</body>
    </html>
  );
}
