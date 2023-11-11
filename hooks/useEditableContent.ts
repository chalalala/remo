import { useState } from 'react';

export const useEditableContent = () => {
  const [name, setName] = useState<string | null>(null);

  const openAdd = () => {
    setName('');
  };

  return { name, setName, openAdd };
};
