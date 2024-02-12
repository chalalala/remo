import { Layout } from '@/components/Layout';
import { NextPageWithLayout } from './_app';
import { SectionList } from '@/components/SectionList';
import { GoogleSignIn } from '@/components/GoogleSignIn';
import { useAppContext } from '@/context/AppContext';

const Home: NextPageWithLayout = () => {
  const { isLoadingToken, accessToken } = useAppContext();

  if (isLoadingToken) {
    return null;
  }

  return (
    <Layout type={accessToken ? 'main' : 'account'}>
      {accessToken ? (
        <div className="px-6 pt-4">
          <SectionList />
        </div>
      ) : (
        <GoogleSignIn />
      )}
    </Layout>
  );
};

export default Home;
