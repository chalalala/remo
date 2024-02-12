import { useAppContext } from '@/context/AppContext';
import { FC } from 'react';
import { Image } from '../Image';

export const GoogleSignIn: FC = () => {
  const { googleAuth } = useAppContext();

  const signIn = () => {
    if (!googleAuth) {
      return;
    }

    googleAuth.requestAccessToken();
  };

  return (
    <div className="flex flex-col items-center space-y-5 p-12">
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2 text-2xl font-bold">
          <span>Welcome to</span>
          <Image
            src="/icons/logoWithName.svg"
            alt="logo"
          />
        </div>
      </div>

      <button
        onClick={signIn}
        className="flex items-stretch"
      >
        <span className="rounded-l border-2 border-indigo-500 p-2.5">
          <Image
            src="/icons/brands/google.svg"
            alt="google"
            width={18}
            height={18}
          />
        </span>
        <span className="flex items-center rounded-r bg-indigo-500 px-3 text-sm font-bold text-white">
          Sign in with Google
        </span>
      </button>
    </div>
  );
};
