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
import { getExpenses } from '@lib/actions/expenses/get-expenses';
import { LoadingCard } from '@components/loaders/loading-card';
import { LoadingTable } from '@components/loaders/loading-table';

const getTotalInMonth = (spendings: Expenses, monthNumber: number) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = months[monthNumber].abbreviation;

  const singleSpendings = spendings?.expenses?.filter(
    (expense) =>
      expense.created_at.toString().includes(currentMonth) &&
      expense.payment_type.toLowerCase().includes('one-time') &&
      expense.created_at.toString().includes(currentYear)
  );

  const monthlySpendings = spendings?.expenses?.filter(
    (expense) => expense.payment_duration
  );

  const monthlyPayments = monthlySpendings?.map((expense) => {
    const startOfPayment = expense.created_at;
    const endOfPayment = new Date(startOfPayment).setMonth(
      new Date(startOfPayment).getMonth() + expense.payment_duration!
    );

    const compareDates =
      currentDate.getFullYear() === new Date(endOfPayment).getFullYear() &&
      currentDate.getMonth() === new Date(endOfPayment).getMonth();

    if (
      new Date(endOfPayment).getTime() > currentDate.getTime() ||
      compareDates
    ) {
      return expense;
    }
  });

  const subscriptions = spendings?.subscriptions?.map((subscription) => {
    const startOfSub = subscription.created_at;
    const endOfSub = new Date(startOfSub).setMonth(
      new Date(startOfSub).getMonth() + subscription?.payment_duration
    );

    const compareDates =
      currentDate.getFullYear() === new Date(endOfSub).getFullYear() &&
      currentDate.getMonth() === new Date(endOfSub).getMonth();

    if (new Date(endOfSub).getTime() > currentDate.getTime() || compareDates) {
      return subscription;
    }
  });

  const expensesTotal = singleSpendings.reduce(
    (sum, expense) => sum + parseFloat(expense.amount as any),
    0
  );

  const monthlyTotal = monthlyPayments?.reduce(
    (sum, payment) => sum + parseFloat(payment?.amount as any),
    0
  );

  const subscriptionsTotal = subscriptions.reduce(
    (sum, subscription) => sum + parseFloat(subscription?.amount as any),
    0
  );

  const totalInMonth = expensesTotal + monthlyTotal + subscriptionsTotal;
  const monthlyCommitments = monthlyTotal + subscriptionsTotal;

  return { totalInMonth, monthlyCommitments };
};

export const ExpensesSummarySection = ({
  spendings,
  isLoading: loadingExpenses,
}: {
  spendings: Expenses;
  isLoading: boolean;
}) => {
  const [totalInMonth, setTotalInMonth] = useState<number | null>(null);
  const [budgetLimit, setBudgetLimit] = useState<number | null>(null);
  const [monthlyCommitments, setMonthlyCommitments] = useState<number | null>(
    null
  );
  const { data: session } = useSession();
  const user_id = session?.user.id;

  const { data, isLoading } = useFetch<BudgetLimit>({
    action: getBudgetLimit,
    user_id,
    initialFetch: true,
  });

  const currentMonth = new Date().getMonth();

  // const totalExpenses = spendings?.reduce(
  //   (sum, expense) => sum + parseFloat(expense.amount as any),
  //   0
  // ); all of spendings so far subs * months, monthly * months, to current date

  useEffect(() => {
    if (spendings) {
      const total = getTotalInMonth(spendings, currentMonth);
      setTotalInMonth(total.totalInMonth);
      setMonthlyCommitments(total.monthlyCommitments);
    }
  }, [spendings, currentMonth]);

  useEffect(() => {
    if (data) {
      const limit = data.budget_limit;
      setBudgetLimit(limit);
    }
  }, [data, budgetLimit]);

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
              <p className="text-center text-xl">{totalInMonth}</p>
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
              <div className="absolute top-1 right-1 z-50">
                <BudgetLimitModal update />
              </div>
            )}
          </Card>
        )}

        {/* {totalExpenses ? (
          <Card className="w-full align-center justify-center">
            <CardHeader className="justify-center">
              <h2 className="text-center text-xl">Total spendings</h2>
            </CardHeader>
            <CardBody>
              <p className="text-center text-xl">{totalExpenses}</p>
            </CardBody>
          </Card>
        ) : (
          <LoadingCard />
        )} */}
        {monthlyCommitments ? (
          <Card className="w-full align-center justify-center">
            <CardHeader className="justify-center">
              <h2 className="text-center text-xl">Monthly commitments</h2>
            </CardHeader>
            <CardBody>
              <p className="text-center text-xl">{monthlyCommitments}</p>
            </CardBody>
          </Card>
        ) : (
          <LoadingCard />
        )}
      </div>

      {/* <div className="flex w-full flex-col lg:flex-row gap-2">
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
      </div> */}
    </section>
  );
};
