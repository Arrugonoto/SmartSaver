'use client';
import { useEffect, useMemo } from 'react';
import type { Expenses } from '@constants/types/expenses/expenses';
import { getExpenses } from '@lib/actions/expenses/get-expenses';
import { useFetch } from '@lib/hooks/useFetch';
import { useExpensesStore } from '@store/expensesStore';
import { ExpensesSummarySection } from '@components/sections/overview/summary';
import { MonthlyChartsSection } from '@components/sections/overview/monthly-charts';
import { AnnualChartSection } from '@components/sections/overview/annual-chart';
import { CreateExpenseModal } from '@components/modals/create-expense-modal';
import { Card, CardBody } from '@nextui-org/card';
import { infoIcons } from '@lib/constants/icons';
import { Spinner } from '@nextui-org/spinner';

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

  const dataNotAvailable =
    !spendings ||
    (spendings.expenses.length === 0 && spendings.subscriptions.length === 0);

  useEffect(() => {
    if (
      spendings.expenses.length === 0 &&
      spendings.subscriptions.length === 0
    ) {
      if (data) setSpendings(data);
    }
  }, [spendings, setSpendings, data]);

  useEffect(() => {
    setTotalResults(totalResults);
  }, [totalResults, setTotalResults]);

  if (isLoading || dataNotAvailable) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full p-2 gap-4 xl:pr-6">
      <div className="flex justify-between">
        <h1 className="text-2xl mb-4">Expenses overview</h1>
        <CreateExpenseModal />
      </div>
      {!isLoading && dataNotAvailable ? (
        <div className="flex w-full h-full justify-center items-center">
          <Card className="p-4">
            <CardBody className="flex-row gap-4 items-start">
              <div className="p-1">
                <infoIcons.informative className="text-2xl text-sky-400" />
              </div>
              <div className="flex flex-col gap-4 items-center pt-2">
                <h2>To enable analytics, add an expense to tracking list</h2>
                <CreateExpenseModal />
              </div>
            </CardBody>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col gap-6 pb-4">
          <ExpensesSummarySection spendings={spendings} isLoading={isLoading} />

          <MonthlyChartsSection />

          <AnnualChartSection />
        </div>
      )}
    </div>
  );
};
