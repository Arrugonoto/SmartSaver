'use client';
import { useState, useEffect } from 'react';
import type { Expense } from '@constants/types/expenses/expenses';
import { getExpenses } from '@lib/actions/expenses/get-expenses';
import { useFetch } from '@lib/hooks/useFetch';
import { useStore } from '@lib/hooks/useStore';
import { useExpensesStore } from '@store/expensesStore';
import { ExpensesSummarySection } from '@components/sections/overview/summary';
import { MonthlyChartsSection } from '@components/sections/overview/monthly-charts';
import { AnnualChartSection } from '@components/sections/overview/annual-chart';

const filterByDateRange = (data: Expense[], monthsRange: number) => {
  // function for filtering data based on range of dates
  const currendDate = new Date();
  const lastDayOfMonth = new Date(
    currendDate.getFullYear(),
    currendDate.getMonth() + 1,
    0
  );
  // get first day of first month in range
  const startDate = new Date(
    currendDate.getFullYear(),
    currendDate.getMonth() - monthsRange + 1,
    1
  );

  const filteredData = data.filter((expense) => {
    const expenseDate = new Date(expense.created_at);
    // check if searched element is inside specified date range
    return expenseDate >= startDate && expenseDate <= lastDayOfMonth;
  });

  return filteredData;
};

export const ExpensesOverview = ({ user_id }: { user_id: string }) => {
  const [dataByDates, setDataByDates] = useState<Expense[]>([]);
  const [dateRange, setDateRange] = useState<string>('current_month');
  const setExpenses = useExpensesStore((state) => state.setExpenses);
  const setTotalResults = useExpensesStore((state) => state.setTotalResults);
  const { data, totalResults } = useFetch<Expense>({
    action: getExpenses,
    user_id,
  });
  const expenses = useStore(useExpensesStore, (state) => state.expenses);

  useEffect(() => {
    setExpenses(data);
  }, [setExpenses, data]);

  useEffect(() => {
    setTotalResults(totalResults);
  }, [totalResults, setTotalResults]);

  useEffect(() => {
    if (expenses) {
      const dateRangeData = filterByDateRange(expenses, 1);
      setDataByDates(dateRangeData);
    }
  }, [expenses]);

  return (
    <div className="flex flex-col w-full h-full p-2 gap-4 xl:pr-6">
      <h1 className="text-2xl mb-4">Expenses overview</h1>
      <ExpensesSummarySection />

      <MonthlyChartsSection />

      <AnnualChartSection />
    </div>
  );
};
