import { Layout } from '@/components/Layout';
import { NextPageWithLayout } from './_app';
import { SectionList } from '@/components/SectionList';
import { GoogleSignIn } from '@/components/GoogleSignIn';
import { useAppContext } from '@/context/AppContext';
import { isExtension } from '@/lib/chromeApi';
import { GoogleApiScript } from '@/components/GoogleApiScript';

const Home: NextPageWithLayout = () => {
  const { accessToken } = useAppContext();

  return (
    <Layout type={accessToken ? 'main' : 'account'}>
      {accessToken ? (
        <div className="px-6 pt-4">
          <SectionList />
        </div>
      ) : (
        <GoogleSignIn />
      )}
      {isExtension() ? null : <GoogleApiScript />}
    </Layout>
  );
};

export default Home;
