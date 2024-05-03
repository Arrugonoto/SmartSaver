import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Expense } from '@lib/constants/types/expenses/expenses';

type State = {
  userId: string;
  expenses: Expense[];
  page: number;
  resultsPerPage: number;
  totalResults: number;
};

type Action = {
  setUserId: (userId: State['userId']) => void;
  setExpenses: (expenses: State['expenses']) => void;
  setPage: (page: State['page']) => void;
  setResultsPerPage: (resultsPerPage: State['resultsPerPage']) => void;
  setTotalResults: (totalResults: State['totalResults']) => void;
};

export const useExpensesStore = create(
  persist<State & Action>(
    (set, get) => ({
      userId: '',
      expenses: [],
      page: 1,
      resultsPerPage: 20,
      totalResults: 0,
      setUserId: (id) => set({ userId: id }),
      setExpenses: (newExpenses) => set({ expenses: newExpenses }),
      setPage: (pageNum) => set({ page: pageNum }),
      setResultsPerPage: (resPerPage) =>
        set(() => ({ resultsPerPage: resPerPage })),
      setTotalResults: (numOfTotal) => set({ totalResults: numOfTotal }),
    }),
    {
      name: 'expenses-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
