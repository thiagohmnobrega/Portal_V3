import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { RNC } from '../types/rnc';

interface RNCStore {
  rncs: RNC[];
  loading: boolean;
  error: string | null;
  setRNCs: (rncs: RNC[]) => void;
  addRNC: (rnc: RNC) => void;
  updateRNC: (id: string, rnc: Partial<RNC>) => void;
  deleteRNC: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useRNCStore = create<RNCStore>()(
  devtools(
    (set) => ({
      rncs: [],
      loading: false,
      error: null,
      setRNCs: (rncs) => set({ rncs }),
      addRNC: (rnc) => set((state) => ({ rncs: [...state.rncs, rnc] })),
      updateRNC: (id, updatedRNC) =>
        set((state) => ({
          rncs: state.rncs.map((rnc) =>
            rnc.id === id ? { ...rnc, ...updatedRNC } : rnc
          ),
        })),
      deleteRNC: (id) =>
        set((state) => ({
          rncs: state.rncs.filter((rnc) => rnc.id !== id),
        })),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    { name: 'rnc-store' }
  )
);