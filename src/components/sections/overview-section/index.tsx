'use client';
import type { Expense } from '@constants/types/expenses/expenses';
import { getExpenses } from '@lib/actions/expenses/get-expenses';
import { useFetch } from '@lib/hooks/useFetch';
import { useExpensesStore } from '@store/expensesStore';

export const OverviewSection = ({ user_id }: { user_id: string }) => {
  const setExpenses = useExpensesStore((state) => state.setExpenses);
  const { isLoading, data, error, totalResults } = useFetch<Expense>({
    action: getExpenses,
    user_id,
  });
  setExpenses(data);

  return <div>overwiev</div>;
};
