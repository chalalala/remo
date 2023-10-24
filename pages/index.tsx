import Head from 'next/head';
import { Layout } from '@/components/Layout';
import { NextPageWithLayout } from './_app';
import { SectionList } from '@/components/SectionList';
import { AppContextProvider } from '@/context/AppContext';

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

      <AppContextProvider>
        <div className="px-6 pt-4">
          <SectionList />
        </div>
      </AppContextProvider>
    </>
  );
};

Home.getLayout = (page) => <Layout>{page}</Layout>;

export default Home;
