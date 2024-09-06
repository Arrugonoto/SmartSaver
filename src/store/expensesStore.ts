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
  removeExpense: (id: string) => void;
  removeSubscription: (id: string) => void;
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
      removeExpense: (id) => {
        const { spendings, totalResults } = get();

        const filteredExpenses = spendings.expenses.filter(
          (expense) => expense.id !== id
        );

        set({
          spendings: {
            ...spendings,
            expenses: filteredExpenses,
          },
          totalResults: totalResults - 1,
        });
      },
      removeSubscription: (id) => {
        const { spendings, totalResults } = get();

        const filteredSubscriptions = spendings.subscriptions.filter(
          (subscription) => subscription.id !== id
        );

        set({
          spendings: {
            ...spendings,
            subscriptions: filteredSubscriptions,
          },
          totalResults: totalResults - 1,
        });
      },
    }),
    {
      name: 'spendings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
