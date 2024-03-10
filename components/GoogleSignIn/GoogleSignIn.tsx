import { FC } from 'react';
import { Image } from '../Image';
import { isExtension } from '@/utils/env';
import { useAppContext } from '@/context/AppContext';

export const GoogleSignIn: FC = () => {
  const { googleAuth, setAccessToken } = useAppContext();

  const signIn = () => {
    if (isExtension()) {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (token) {
          setAccessToken(token);
        }
      });

      return;
    }

    if (!googleAuth) {
      return;
    }

    googleAuth.requestAccessToken();
  };

  return (
    <div className="flex flex-col items-center space-y-5 p-12">
      <div className="space-y-2 text-center">
        <div className="flex items-center justify-center gap-2 text-2xl font-bold">
          <span>Welcome to</span>
          <Image
            src="/icons/logoWithName.svg"
            alt="logo"
          />
        </div>
        <p className="text-sm font-medium leading-normal">A simple resource manager</p>
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
        <span className="flex items-center rounded-r bg-indigo-500 px-3 text-sm font-medium text-white">
          Sign in with Google
        </span>
      </button>
    </div>
  );
};
