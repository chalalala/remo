import { Roboto } from 'next/font/google';

export const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin-ext'],
  display: 'swap',
  variable: '--font-roboto',
  fallback: ['system-ui', 'arial'],
});
