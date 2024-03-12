import { FC } from 'react';
import { Image } from '../Image';
import { Button, ButtonVariant } from '../Button';

export const Error: FC = () => {
  return (
    <div className="flex flex-col items-center gap-2 py-12">
      <Image
        src="/icons/remo-cry.svg"
        alt="Error"
      />
      <h2 className="text-2xl font-medium leading-normal text-red-600">Oops, there is an error!</h2>
      <Button
        variant={ButtonVariant.SOLID}
        onClick={window.location.reload}
        className="bg-primary px-4 py-1.5 text-sm font-medium uppercase leading-normal text-white"
      >
        Reload
      </Button>
    </div>
  );
};
