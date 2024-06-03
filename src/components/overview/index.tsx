'use client';
import { useEffect } from 'react';
import type { Expense } from '@constants/types/expenses/expenses';
import { getExpenses } from '@lib/actions/expenses/get-expenses';
import { useFetch } from '@lib/hooks/useFetch';
import { useExpensesStore } from '@store/expensesStore';
import { ExpensesSummarySection } from '@components/sections/overview/summary';
import { MonthlyChartsSection } from '@components/sections/overview/monthly-charts';
import { AnnualChartSection } from '@components/sections/overview/annual-chart';

export const ExpensesOverview = ({ user_id }: { user_id: string }) => {
  const setExpenses = useExpensesStore((state) => state.setExpenses);
  const setTotalResults = useExpensesStore((state) => state.setTotalResults);
  const { data, totalResults } = useFetch<Expense[]>({
    action: getExpenses,
    user_id,
  });

  useEffect(() => {
    if (data) setExpenses(data);
  }, [setExpenses, data]);

  useEffect(() => {
    setTotalResults(totalResults);
  }, [totalResults, setTotalResults]);

  return (
    <div className="flex flex-col w-full h-full p-2 gap-4 xl:pr-6">
      <h1 className="text-2xl mb-4">Expenses overview</h1>
      <div className="flex flex-col gap-6">
        <ExpensesSummarySection />

        <MonthlyChartsSection />

        <AnnualChartSection />
      </div>
    </div>
  );
};
