import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GlobalState {
  userEmail: string | null;
  setUserEmail: (email: string | null) => void;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      userEmail: null,
      setUserEmail: (email) => set({ userEmail: email }),
    }),
    {
      name: 'global-store',
    },
  ),
);
