import { create } from 'zustand';

interface State {
  isBackingUp: boolean;
  setIsBackingUp: (isBackingUp: boolean) => void;
}

export const useResources = create<State>((set) => ({
  isBackingUp: false,

  setIsBackingUp: (isBackingUp) => set({ isBackingUp }),
}));
