'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@lib/hooks/useStore';
import { useExpensesStore } from '@store/expensesStore';
import { Card, CardHeader, CardBody } from '@nextui-org/card';
import { TopSpendingsTabs } from '@components/tabs/top-spendings';
import { months } from '@lib/constants/data/dummy/months';
import type { Expense } from '@constants/types/expenses/expenses';
import { BudgetLimitModal } from '@components/modals/budget-limit-modal';
import { useFetch } from '@lib/hooks/useFetch';
import { getBudgetLimit } from '@lib/actions/budget/get-budget-limit';
import type { BudgetLimit } from '@lib/constants/types/budget/budget';
import { useSession } from 'next-auth/react';
import { Spinner } from '@nextui-org/spinner';

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

export const ExpensesSummarySection = () => {
  const expenses = useStore(useExpensesStore, (state) => state.expenses);
  const [totalInMonth, setTotalInMonth] = useState<number>(0);
  const [budgetLimit, setBudgetLimit] = useState<number | null>(null);
  const [monthlyCommitments, setMonthlyCommitments] = useState<number | null>(
    null
  );
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const { data: session } = useSession();
  const user_id = session?.user.id;

  const currentMonth = new Date().getMonth();

  const { data, isLoading } = useFetch<BudgetLimit>({
    action: getBudgetLimit,
    user_id,
  });

  console.log(data);

  const totalExpenses = expenses?.reduce(
    (sum, expense) => sum + parseFloat(expense.amount as any),
    0
  );

  useEffect(() => {
    if (expenses) {
      const total = getTotalInMonth(expenses, currentMonth);
      setTotalInMonth(total);
    }
  }, [expenses, currentMonth]);

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
      setInitialLoad(false);
    }
  }, [data]);

  return (
    <section className="flex flex-col w-full gap-4">
      <div className="flex gap-2 w-full">
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

        <Card className="relative w-full align-center justify-center">
          <CardHeader className="justify-center">
            <h2 className="text-center text-xl">Budget</h2>
          </CardHeader>
          <CardBody className="items-center">
            {initialLoad || isLoading ? (
              <Spinner />
            ) : budgetLimit !== null ? (
              <h2 className="text-center text-xl">{budgetLimit}</h2>
            ) : (
              <BudgetLimitModal />
            )}
          </CardBody>
          <div className="absolute top-1 right-1 z-[100]">
            <BudgetLimitModal update />
          </div>
        </Card>

        <Card className="w-full align-center justify-center">
          <CardHeader className="justify-center">
            <h2 className="text-center text-xl">Total spendings</h2>
          </CardHeader>
          <CardBody>
            <p className="text-center text-2xl">{totalExpenses}</p>
          </CardBody>
        </Card>
        <Card className="w-full align-center justify-center">
          <CardHeader className="justify-center">
            <h2 className="text-center text-xl">Monthly commitments</h2>
          </CardHeader>
          <CardBody>
            <p className="text-center text-2xl">{monthlyCommitments}</p>
          </CardBody>
        </Card>
      </div>

      <div className="flex w-full gap-2">
        <Card className="w-full">
          <CardBody>
            <div className="w-full">
              spendings bar chart by current and previous month
            </div>
          </CardBody>
        </Card>
        <Card className="flex items-center min-h-[320px] max-w-[640px] w-full p-4 gap-2">
          <h2 className="text-xl">10 most expensive spendings</h2>
          <CardBody>
            <TopSpendingsTabs />
          </CardBody>
        </Card>
      </div>
    </section>
  );
};
