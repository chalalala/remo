import { Error } from '@/components/Error';
import { NextPageWithLayout } from './_app';
import { ErrorProps } from 'next/error';
import { Layout } from '@/components/Layout';

const NotFound: NextPageWithLayout<ErrorProps> = () => {
  return <Error />;
};

NotFound.getLayout = (page) => <Layout type="account">{page}</Layout>;

export default NotFound;
