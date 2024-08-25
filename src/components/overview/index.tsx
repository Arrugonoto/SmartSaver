'use client';
import { useEffect } from 'react';
import type { Expenses } from '@constants/types/expenses/expenses';
import { getExpenses } from '@lib/actions/expenses/get-expenses';
import { useFetch } from '@lib/hooks/useFetch';
import { useExpensesStore } from '@store/expensesStore';
import { ExpensesSummarySection } from '@components/sections/overview/summary';
import { MonthlyChartsSection } from '@components/sections/overview/monthly-charts';
import { AnnualChartSection } from '@components/sections/overview/annual-chart';
import { CreateExpenseModal } from '@components/modals/create-expense-modal';

export const ExpensesOverview = ({ user_id }: { user_id: string }) => {
  const { setSpendings, setTotalResults, spendings } = useExpensesStore(
    (state) => ({
      setSpendings: state.setSpendings,
      setTotalResults: state.setTotalResults,
      spendings: state.spendings,
    })
  );
  const { data, totalResults, isLoading } = useFetch<Expenses>({
    action: getExpenses,
    user_id,
    initialFetch: true,
  });

  useEffect(() => {
    if (data) setSpendings(data);
  }, [setSpendings, data]);

  useEffect(() => {
    setTotalResults(totalResults);
  }, [totalResults, setTotalResults]);

  return (
    <div className="flex flex-col w-full h-full p-2 gap-4 xl:pr-6">
      <div className="flex justify-between">
        <h1 className="text-2xl mb-4">Expenses overview</h1>
        <CreateExpenseModal />
      </div>
      <div className="flex flex-col gap-6 pb-4">
        <ExpensesSummarySection spendings={spendings} isLoading={isLoading} />

        <MonthlyChartsSection />

        <AnnualChartSection />
      </div>
    </div>
  );
};
