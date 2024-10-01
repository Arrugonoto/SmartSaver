import { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '@nextui-org/card';
import { TopSpendingsTabs } from '@components/tabs/top-spendings';
import { months } from '@lib/constants/data/dummy/months';
import type { Expenses } from '@constants/types/expenses/expenses';
import { BudgetLimitModal } from '@components/modals/budget-limit-modal';
import { useFetch } from '@lib/hooks/useFetch';
import { getBudgetLimit } from '@lib/actions/budget/get-budget-limit';
import type { BudgetLimit } from '@lib/constants/types/budget/budget';
import { useSession } from 'next-auth/react';
import { SpendingsWithBudgetChart } from '@components/charts/spendings-with-budget-chart';
import { LoadingCard } from '@components/loaders/loading-card';
import { LoadingTable } from '@components/loaders/loading-table';
import { getTotalInMonth } from '@lib/helpers/get-total-in-month';
import { calcTotalExpensesSoFar } from '@lib/helpers/get-total-spendings-so-far';
import { useExpensesStore } from '@store/expensesStore';

export const ExpensesSummarySection = ({
  spendings,
  isLoading: loadingExpenses,
}: {
  spendings: Expenses;
  isLoading: boolean;
}) => {
  const { data: session } = useSession();
  const user_id = session?.user.id;
  const [totalInMonth, setTotalInMonth] = useState<number | null>(null);
  const [monthlyCommitments, setMonthlyCommitments] = useState<number | null>(
    null
  );
  const [totalSpendingsSoFar, setTotalSpendingsSoFar] = useState<number | null>(
    null
  );
  const { budgetLimit, setBudgetLimit } = useExpensesStore((state) => ({
    budgetLimit: state.budgetLimit,
    setBudgetLimit: state.setBudgetLimit,
  }));

  const { data, isLoading } = useFetch<BudgetLimit>({
    action: getBudgetLimit,
    user_id,
    initialFetch: true,
  });

  const currentMonth = new Date().getMonth();

  useEffect(() => {
    const currentDate = new Date();

    if (spendings) {
      const total = getTotalInMonth(spendings, currentDate);
      setTotalInMonth(total.totalInMonth);
      setMonthlyCommitments(total.monthlyCommitments);
    }
  }, [spendings, currentMonth]);

  useEffect(() => {
    if (spendings) {
      const totalSpendings = calcTotalExpensesSoFar(spendings);
      setTotalSpendingsSoFar(totalSpendings);
    }
  }, [spendings]);

  useEffect(() => {
    if (data) {
      const stringifiedLimit = data.budget_limit.toString();
      const parsedLimit = parseFloat(stringifiedLimit);

      setBudgetLimit(parsedLimit);
    }
  }, [data, setBudgetLimit]);

  return (
    <section className="flex flex-col w-full gap-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 w-full h-full min-h-[120px]">
        {totalInMonth ? (
          <Card className="w-full align-center justify-center">
            <CardHeader className="justify-center">
              <h2 className="text-center text-xl">
                Spendings in {months[currentMonth].name}
              </h2>
            </CardHeader>
            <CardBody>
              <p className="text-center text-xl">{totalInMonth.toFixed(2)}</p>
            </CardBody>
          </Card>
        ) : (
          <LoadingCard />
        )}
        {isLoading && !budgetLimit ? (
          <LoadingCard />
        ) : (
          <Card className="relative w-full align-center justify-center">
            <CardHeader className="justify-center">
              <h2 className="text-center text-xl">Budget</h2>
            </CardHeader>
            <CardBody className="items-center">
              {budgetLimit === 0 ? (
                <BudgetLimitModal />
              ) : (
                <h2 className="text-center text-xl">
                  {parseFloat(budgetLimit.toString()).toFixed(2)}
                </h2>
              )}
            </CardBody>

            {!isLoading && budgetLimit > 0 && (
              <div className="absolute top-1 right-1 z-50">
                <BudgetLimitModal update />
              </div>
            )}
          </Card>
        )}

        {totalSpendingsSoFar ? (
          <Card className="w-full align-center justify-center">
            <CardHeader className="justify-center">
              <h2 className="text-center text-xl">Total spendings</h2>
            </CardHeader>
            <CardBody>
              <p className="text-center text-xl">
                {totalSpendingsSoFar.toFixed(2)}
              </p>
            </CardBody>
          </Card>
        ) : (
          <LoadingCard />
        )}
        {!monthlyCommitments && typeof monthlyCommitments !== 'number' ? (
          <LoadingCard />
        ) : (
          <Card className="w-full align-center justify-center">
            <CardHeader className="justify-center">
              <h2 className="text-center text-xl">Monthly commitments</h2>
            </CardHeader>
            <CardBody>
              <p className="text-center text-xl">
                {monthlyCommitments.toFixed(2) ?? 0}
              </p>
            </CardBody>
          </Card>
        )}
      </div>

      <div className="flex w-full flex-col lg:flex-row gap-2">
        <Card className="w-full lg:w-1/2">
          <CardBody>
            <SpendingsWithBudgetChart />
          </CardBody>
        </Card>
        <Card className="flex items-center min-h-[320px] w-full lg:w-1/2 p-4 gap-2">
          <h2 className="text-xl">10 most expensive spendings</h2>
          <CardBody>
            {!spendings || loadingExpenses ? (
              <LoadingTable sm />
            ) : (
              <TopSpendingsTabs />
            )}
          </CardBody>
        </Card>
      </div>
    </section>
  );
};
