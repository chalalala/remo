import { Section } from '@/types/Resource';
import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

interface AppContextValue {
  sections: Section[];
  setSections: Dispatch<SetStateAction<Section[]>>;
}

const AppContext = createContext<AppContextValue>({} as never);

export const AppContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [sections, setSections] = useState<Section[]>(() => [
    {
      id: 'section1',
      name: 'Item with a very very very very very very very very very very very very long name',
      items: [
        {
          id: 'test1',
          url: 'https://google.com',
          name: 'Item 1',
          icon: '',
        },
        {
          id: 'test2',
          name: 'Item 2 with a very very very very very very very very very very very very long name',
          url: '',
          icon: '',
        },
      ],
    },
    {
      id: 'section2',
      name: 'Item 2',
      items: [],
    },
  ]);

  const contextValue: AppContextValue = {
    sections,
    setSections,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
