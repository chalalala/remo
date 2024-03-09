import { FC } from 'react';

export const Loader: FC = () => {
  return (
    <div className="flex items-center gap-2">
      <span className="animate-gradient-x bg-gradient-to-l from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
        Loading
      </span>
      <span className="relative ml-4 box-border block h-2 w-2 animate-loading rounded-full bg-white shadow-loader" />
    </div>
  );
};
