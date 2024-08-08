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
    (sum, expense) => sum + parseFloat(expense?.amount as any),
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

const calcTotalExpenses = (spendings: Expenses) => {
  // declare arrays which will hold values of total spendings, and subscriptions so far of monthly payments
  const monthlyPaymentsSoFar: number[] = [];
  const subscriptionsSoFar: number[] = [];

  const singleSpendings = spendings?.expenses.filter(
    (expense) => expense.payment_type === 'one-time'
  );

  const monthlySpendings = spendings?.expenses.filter(
    (expense) => expense.payment_type === 'monthly'
  );

  const calcMonthlySoFar = monthlySpendings.map((expense) => {
    // Calculate difference in month from start of payment, to current date
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const startYear = new Date(expense.created_at).getFullYear();
    const startMonth = new Date(expense.created_at).getMonth();

    const yearDiff = (currentYear - startYear) * 12; // multiply year with 12 months
    const monthDiff = currentMonth - startMonth + 1; // payment always starts from first month, add 1 to include first payment on start

    const totalMonthDiff = yearDiff + monthDiff;

    if (totalMonthDiff <= (expense.payment_duration as number)) {
      monthlyPaymentsSoFar.push(
        totalMonthDiff * parseFloat(expense.amount as any)
      );
    } else {
      monthlyPaymentsSoFar.push(
        (expense.payment_duration as number) * parseFloat(expense.amount as any)
      );
    }
  });

  const calcSubscriptionsSoFar = spendings.subscriptions.map((subscription) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const startYear = new Date(subscription.created_at).getFullYear();
    const startMonth = new Date(subscription.created_at).getMonth();

    const yearDiff = (currentYear - startYear) * 12;
    const monthDiff = currentMonth - startMonth + 1;

    const totalMonthDiff = yearDiff + monthDiff;

    if (totalMonthDiff <= (subscription.payment_duration as number)) {
      subscriptionsSoFar.push(
        totalMonthDiff * parseFloat(subscription.amount as any)
      );
    } else {
      subscriptionsSoFar.push(
        (subscription.payment_duration as number) *
          parseFloat(subscription.amount as any)
      );
    }
  });

  const totalSingle = singleSpendings.reduce(
    (sum, expense) => sum + parseFloat(expense.amount as any),
    0
  );

  const totalMonthly = monthlyPaymentsSoFar.reduce(
    (sum, amount) => sum + amount,
    0
  );

  const totalSubscriptions = subscriptionsSoFar.reduce(
    (sum, amount) => sum + amount,
    0
  );

  const totalSpendingsSoFar = totalSingle + totalMonthly + totalSubscriptions;
  console.log(totalSpendingsSoFar);
  return totalSpendingsSoFar;
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
  const [totalSpendingsSoFar, setTotalSpendingsSoFar] = useState<number | null>(
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

  // all of spendings so far subs * months, monthly * months, to current date

  useEffect(() => {
    if (spendings) {
      const total = getTotalInMonth(spendings, currentMonth);
      setTotalInMonth(total.totalInMonth);
      setMonthlyCommitments(total.monthlyCommitments);
    }
  }, [spendings, currentMonth]);

  useEffect(() => {
    if (spendings) {
      const totalSpendings = calcTotalExpenses(spendings);
      setTotalSpendingsSoFar(totalSpendings);
    }
  }, [spendings]);

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

        {totalSpendingsSoFar ? (
          <Card className="w-full align-center justify-center">
            <CardHeader className="justify-center">
              <h2 className="text-center text-xl">Total spendings</h2>
            </CardHeader>
            <CardBody>
              <p className="text-center text-xl">{totalSpendingsSoFar}</p>
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
