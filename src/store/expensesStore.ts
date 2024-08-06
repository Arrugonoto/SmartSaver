import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Expenses } from '@lib/constants/types/expenses/expenses';

type State = {
  userId: string;
  spendings: Expenses;
  page: number;
  resultsPerPage: number;
  totalResults: number;
  loadingSpendings: boolean;
};

type Action = {
  setUserId: (userId: State['userId']) => void;
  setSpendings: (spendings: State['spendings']) => void;
  setPage: (page: State['page']) => void;
  setResultsPerPage: (resultsPerPage: State['resultsPerPage']) => void;
  setTotalResults: (totalResults: State['totalResults']) => void;
  setLoadingExpenses: (loadingExpenses: State['loadingSpendings']) => void;
};

export const useExpensesStore = create(
  persist<State & Action>(
    (set, get) => ({
      userId: '',
      spendings: { expenses: [], subscriptions: [] },
      page: 1,
      resultsPerPage: 20,
      totalResults: 0,
      loadingSpendings: true,
      setUserId: (id) => set({ userId: id }),
      setSpendings: (newSpendings) => set({ spendings: newSpendings }),
      setPage: (pageNum) => set({ page: pageNum }),
      setResultsPerPage: (resPerPage) =>
        set(() => ({ resultsPerPage: resPerPage })),
      setTotalResults: (numOfTotal) => set({ totalResults: numOfTotal }),
      setLoadingExpenses: (loadingState) =>
        set({ loadingSpendings: loadingState }),
    }),
    {
      name: 'spendings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
