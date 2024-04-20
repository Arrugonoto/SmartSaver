import { create } from 'zustand';
import type { Expense } from '@lib/constants/types/expenses/expenses';

type State = {
  expenses: Expense[];
  page: number;
  numOfResults: number;
};

type Action = {
  setExpenses: (expenses: State['expenses']) => void;
  setPage: (page: State['page']) => void;
  setNumOfResults: (numOfResults: State['numOfResults']) => void;
};

export const useExpensesStore = create<State & Action>((set) => ({
  expenses: [],
  page: 1,
  numOfResults: 20,
  setExpenses: (newExpenses) => set(() => ({ expenses: [...newExpenses] })),
  setPage: (pageNum) => set(() => ({ page: pageNum })),
  setNumOfResults: (newNumOfResults) =>
    set(() => ({ numOfResults: newNumOfResults })),
}));
