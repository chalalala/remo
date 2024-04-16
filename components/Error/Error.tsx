import { FC } from 'react';
import { Image } from '../Image';
import { Button } from '../Button';

export const Error: FC = () => {
  return (
    <div className="flex flex-col items-center gap-2 py-12">
      <Image
        src="/icons/remo-cry.svg"
        alt="Error"
      />
      <h2 className="text-2xl font-medium leading-normal text-red-600">Oops, there is an error!</h2>
      <Button
        onClick={window.location.reload}
        className="text-sm leading-normal"
      >
        Reload
      </Button>
    </div>
  );
};
