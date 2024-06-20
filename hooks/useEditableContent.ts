import { useState } from 'react';

export const useEditableContent = () => {
  const [name, setName] = useState<string | null>(null);
  const [defaultName, setDefaultName] = useState('');

  const openAdd = () => {
    setName(defaultName);
  };

  return { name, setName, setDefaultName, openAdd };
};
