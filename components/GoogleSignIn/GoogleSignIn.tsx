import { FC } from 'react';
import { Image } from '../Image';
import { isExtension } from '@/lib/chromeApi';
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
    <div className="flex flex-col items-center space-y-5 p-12 desktop:h-full desktop:justify-center">
      <div className="space-y-2 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 desktop:flex-col desktop:gap-4">
          <div className="desktop:order-1 desktop:flex desktop:gap-2">
            <span className="text-2xl font-bold desktop:text-4xl">Welcome to</span>
            <span className="hidden font-bold text-indigo-500 desktop:block desktop:text-4xl">
              REMO 🎉
            </span>
          </div>
          <picture>
            <source
              media="(min-width: 768px)"
              srcSet="/icons/logo.svg"
              width={120}
            />

            <img
              src="/icons/logoWithName.svg"
              alt="logo"
            />
          </picture>
        </div>
        <p className="text-sm font-medium leading-normal desktop:text-xl">
          A simple resource manager
        </p>
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
