import { useState, useEffect, Suspense } from 'react';
import { Card, CardHeader, CardBody } from '@nextui-org/card';
import { TopSpendingsTabs } from '@components/tabs/top-spendings';
import { months } from '@lib/constants/data/dummy/months';
import type { Expense } from '@constants/types/expenses/expenses';
import { BudgetLimitModal } from '@components/modals/budget-limit-modal';
import { useFetch } from '@lib/hooks/useFetch';
import { getBudgetLimit } from '@lib/actions/budget/get-budget-limit';
import type { BudgetLimit } from '@lib/constants/types/budget/budget';
import { useSession } from 'next-auth/react';
import { SpendingsWithBudgetChart } from '@components/charts/spendings-with-budget-chart';
import { getExpenses } from '@lib/actions/expenses/get-expenses';
import { LoadingCard } from '@components/loaders/loading-card';

const getTotalInMonth = (expenses: Expense[], monthNumber: number) => {
  const currentMonth = months[monthNumber].abbreviation;

  const filteredByMonth = expenses?.filter(
    (expense) =>
      expense.created_at.toString().includes(currentMonth) ||
      expense.payment_type.toLocaleLowerCase().includes('monthly') ||
      expense.payment_type.toLowerCase().includes('subscription')
  );

  const totalInMonth = filteredByMonth.reduce(
    (sum, expense) => sum + parseFloat(expense.amount as any),
    0
  );

  return totalInMonth as number;
};

const sumMonthlyCommitments = (expenses: Expense[]) => {
  const monthlyPayments = expenses?.filter(
    (expense) => expense.payment_type !== 'one-time'
  );

  const commitmentsSummary = monthlyPayments?.reduce(
    (sum, expense) => sum + parseFloat(expense.amount as any),
    0
  );

  return commitmentsSummary;
};

export const ExpensesSummarySection = ({
  expenses,
}: {
  expenses: Expense[];
}) => {
  const [totalInMonth, setTotalInMonth] = useState<number | null>(null);
  const [budgetLimit, setBudgetLimit] = useState<number | null>(null);
  const [monthlyCommitments, setMonthlyCommitments] = useState<number | null>(
    null
  );
  const { data: session } = useSession();
  const user_id = session?.user.id;
  const { data: userExpenses } = useFetch<Expense[]>({
    action: getExpenses,
    user_id,
  });

  const currentMonth = new Date().getMonth();

  const { data, isLoading } = useFetch<BudgetLimit>({
    action: getBudgetLimit,
    user_id,
  });

  const totalExpenses = expenses?.reduce(
    (sum, expense) => sum + parseFloat(expense.amount as any),
    0
  );

  useEffect(() => {
    if (userExpenses) {
      const total = getTotalInMonth(userExpenses, currentMonth);
      setTotalInMonth(total);
    }
  }, [userExpenses, currentMonth]);

  useEffect(() => {
    if (expenses) {
      const data = sumMonthlyCommitments(expenses);
      setMonthlyCommitments(data);
    }
  }, [expenses]);

  useEffect(() => {
    if (data) {
      const limit = data.budget_limit;
      setBudgetLimit(limit);
    }
  }, [data, budgetLimit]);

  return (
    <section className="flex flex-col w-full gap-4">
      <div className="flex gap-2 w-full h-full min-h-[120px]">
        {totalInMonth ? (
          <Card className="w-full align-center justify-center">
            <CardHeader className="justify-center">
              <h2 className="text-center text-xl">
                Spendings in {months[currentMonth].name}
              </h2>
            </CardHeader>
            <CardBody>
              <p className="text-center text-2xl">{totalInMonth}</p>
            </CardBody>
          </Card>
        ) : (
          <LoadingCard />
        )}
        {!budgetLimit ? (
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
                <h2 className="text-center text-xl">{budgetLimit}</h2>
              )}
            </CardBody>

            {!isLoading && budgetLimit && (
              <div className="absolute top-1 right-1 z-[100]">
                <BudgetLimitModal update />
              </div>
            )}
          </Card>
        )}

        {totalExpenses ? (
          <Card className="w-full align-center justify-center">
            <CardHeader className="justify-center">
              <h2 className="text-center text-xl">Total spendings</h2>
            </CardHeader>
            <CardBody>
              <p className="text-center text-2xl">{totalExpenses}</p>
            </CardBody>
          </Card>
        ) : (
          <LoadingCard />
        )}
        {monthlyCommitments ? (
          <Card className="w-full align-center justify-center">
            <CardHeader className="justify-center">
              <h2 className="text-center text-xl">Monthly commitments</h2>
            </CardHeader>
            <CardBody>
              <p className="text-center text-2xl">{monthlyCommitments}</p>
            </CardBody>
          </Card>
        ) : (
          <LoadingCard />
        )}
      </div>

      <div className="flex w-full gap-2">
        <Card className="w-1/2">
          <CardBody className="">
            <SpendingsWithBudgetChart />
          </CardBody>
        </Card>
        <Card className="flex items-center min-h-[320px] w-1/2 p-4 gap-2">
          <h2 className="text-xl">10 most expensive spendings</h2>
          <CardBody>
            <TopSpendingsTabs />
          </CardBody>
        </Card>
      </div>
    </section>
  );
};
