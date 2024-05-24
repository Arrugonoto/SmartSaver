'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@lib/hooks/useStore';
import { useExpensesStore } from '@store/expensesStore';
import { Card, CardHeader, CardBody } from '@nextui-org/card';
import { TopSpendingsTabs } from '@components/tabs/top-spendings';
import { months } from '@lib/constants/data/dummy/months';
import type { Expense } from '@constants/types/expenses/expenses';

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

export const ExpensesSummarySection = () => {
  const expenses = useStore(useExpensesStore, (state) => state.expenses);
  const [totalInMonth, setTotalInMonth] = useState<number>(0);
  const currentMonth = new Date().getMonth();

  const totalExpenses = expenses?.reduce(
    (sum, expense) => sum + parseFloat(expense.amount as any),
    0
  );

  const monthlyCommitments = () => {
    const monthlyPayments = expenses?.filter(
      (expense) => expense.payment_type !== 'one-time'
    );

    const commitmentsSummary = monthlyPayments?.reduce(
      (sum, expense) => sum + parseFloat(expense.amount as any),
      0
    );

    return commitmentsSummary;
  };

  useEffect(() => {
    if (expenses) {
      const total = getTotalInMonth(expenses, currentMonth);
      setTotalInMonth(total);
    }
  }, [expenses, currentMonth]);

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
        <Card className="w-full align-center justify-center">
          <CardHeader className="justify-center">
            <h2 className="text-center text-xl">Budget</h2>
          </CardHeader>
          <CardBody>
            <p className="text-center text-xl">Set limit now</p>
          </CardBody>
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
            <p className="text-center text-2xl">{monthlyCommitments()}</p>
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
