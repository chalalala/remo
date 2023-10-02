import { roboto } from '@/constants/typography';
import clsx from 'clsx';
import Head from 'next/head';

export default function Home() {
  return (
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

      <div className={clsx('mx-auto flex w-[480px] max-w-full', roboto.variable)}>
        <button onClick={() => alert('Hello')}>Click me</button>
      </div>
    </>
  );
}
