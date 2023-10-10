import Head from 'next/head';
import { Layout } from '@/components/Layout';
import { NextPageWithLayout } from './_app';
import { SectionList } from '@/components/SectionList';

const Home: NextPageWithLayout = () => {
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

      <div className="px-6 py-4">
        <SectionList />
      </div>
    </>
  );
};

Home.getLayout = (page) => <Layout>{page}</Layout>;

export default Home;
