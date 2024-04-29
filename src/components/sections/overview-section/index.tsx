'use client';
import type { Expense } from '@constants/types/expenses/expenses';
import { getExpenses } from '@lib/actions/expenses/get-expenses';
import { useFetch } from '@lib/hooks/useFetch';
import { useExpensesStore } from '@store/expensesStore';
import { Card, CardBody } from '@nextui-org/card';

export const OverviewSection = ({ user_id }: { user_id: string }) => {
  const setExpenses = useExpensesStore((state) => state.setExpenses);
  const expenses = useExpensesStore((state) => state.expenses);
  const { isLoading, data, error, totalResults } = useFetch<Expense>({
    action: getExpenses,
    user_id,
  });
  setExpenses(data);

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount as any),
    0
  );
  const monthlyCommitments = () => {
    const monthlyPayments = expenses.filter(
      (expense) => expense.payment_type !== 'one-time'
    );
    console.log(monthlyPayments);

    const commitmentsSummary = monthlyPayments.reduce(
      (sum, expense) => sum + parseFloat(expense.amount as any),
      0
    );

    return commitmentsSummary;
  };

  return (
    <div className="p-2">
      <div>
        <h1 className="text-2xl mb-4">Spendings overview</h1>
        <div className="flex gap-4">
          <section className="flex w-full gap-4">
            <Card className="max-w-[300px] w-full align-center justify-center">
              <CardBody className="gap-4">
                <h2 className="text-center text-xl">Total expenses</h2>
                <p className="text-center text-2xl">{totalExpenses}</p>
              </CardBody>
            </Card>
            <Card className="max-w-[300px] w-full align-center justify-center">
              <CardBody className="gap-4">
                <h2 className="text-center text-xl">Monthly commitments</h2>
                <p className="text-center text-2xl">{monthlyCommitments()}</p>
              </CardBody>
            </Card>
          </section>
        </div>
      </div>
      <div>
        <section>spendings bar chart by months</section>
        <section>spendings by category pie chart for current month</section>
      </div>
    </div>
  );
};
