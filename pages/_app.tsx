import { AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';
import { AppContextProvider } from '@/context/AppContext';
import Head from 'next/head';
import '../styles/globals.css';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(
    <>
      <Head>
        <title>REMO</title>
        <meta
          name="description"
          content="A simple resource manager"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>

      <ErrorBoundary>
        <AppContextProvider>
          <Component {...pageProps} />
        </AppContextProvider>
      </ErrorBoundary>
    </>,
  );
}

export default MyApp;
