'use client';
import { useEffect } from 'react';
import type { Expense } from '@constants/types/expenses/expenses';
import { getExpenses } from '@lib/actions/expenses/get-expenses';
import { useFetch } from '@lib/hooks/useFetch';
import { useStore } from '@lib/hooks/useStore';
import { useExpensesStore } from '@store/expensesStore';
import { Card, CardBody } from '@nextui-org/card';
import { Tabs, Tab } from '@nextui-org/tabs';
import { AnnualSpendingsAreaChart } from '@components/charts/annual-spendings-area-chart';
import { ExpenseCategoryPieChart } from '@components/charts/category-pie-chart';
import { ExpenseCategoryBarChart } from '@components/charts/category-bar-chart';
import { Select, SelectItem } from '@nextui-org/select';
import { selectIcons } from '@constants/icons';
import { TopSpendingsTabs } from '@components/tabs/top-spendings';

export const OverviewSection = ({ user_id }: { user_id: string }) => {
  const setExpenses = useExpensesStore((state) => state.setExpenses);
  const setTotalResults = useExpensesStore((state) => state.setTotalResults);
  const { data, totalResults } = useFetch<Expense>({
    action: getExpenses,
    user_id,
  });
  const expenses = useStore(useExpensesStore, (state) => state.expenses);

  const totalExpenses = expenses?.reduce(
    (sum, expense) => sum + parseFloat(expense.amount as any),
    0
  );

  const totalNumOfExpensesInMonth = expenses?.filter(
    (expense) =>
      expense.created_at.toString().includes('Apr') ||
      expense.payment_type.toLocaleLowerCase().includes('monthly') ||
      expense.payment_type.toLowerCase().includes('subscription')
  ).length;

  const highestSubscriptions = expenses
    ?.filter((expense) => expense.payment_type === 'subscription')
    .sort((a, b) => parseFloat(b.amount as any) - parseFloat(a.amount as any))
    .slice(0, 10);

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
    setExpenses(data);
  }, [setExpenses, data]);

  useEffect(() => {
    setTotalResults(totalResults);
  }, [totalResults, setTotalResults]);

  return (
    <div className="flex flex-col w-full h-full p-2 gap-4">
      <h1 className="text-2xl mb-4">Spendings overview</h1>
      <section className="flex w-full gap-4">
        <div className="flex flex-col max-w-[620px] w-full gap-2">
          <div className="flex gap-2 w-full">
            <Card className="w-full align-center justify-center">
              <CardBody className="w-full gap-4">
                <h2 className="text-center text-xl">Total spendings</h2>
                <p className="text-center text-2xl">{totalExpenses}</p>
              </CardBody>
            </Card>
            <Card className="w-full align-center justify-center">
              <CardBody className="gap-4">
                <h2 className="text-center text-xl">Monthly commitments</h2>
                <p className="text-center text-2xl">{monthlyCommitments()}</p>
              </CardBody>
            </Card>
          </div>
          <Card className="flex items-center min-h-[320px] w-full p-4 gap-2">
            <h2 className="text-xl">10 most expensive spendings</h2>
            <CardBody>
              <TopSpendingsTabs />
            </CardBody>
          </Card>
        </div>
        <div>spendings bar chart by current and previous month</div>
      </section>
      <section className="flex flex-col pb-8 pr-2 xl:pr-4 gap-4">
        <Card className="w-full p-4">
          <AnnualSpendingsAreaChart />
        </Card>

        <Card className="flex flex-col w-full px-4 pt-4 gap-4">
          <div className="flex w-full justify-between">
            <p>Total number of expenses: {totalNumOfExpensesInMonth}</p>
            <Select
              label="Select date range"
              variant="bordered"
              defaultSelectedKeys={['current_month']}
              size="md"
              className="max-w-xs"
              startContent={<selectIcons.calendarEmpty />}
            >
              <SelectItem key={'current_month'} value={'current_month'}>
                Current month
              </SelectItem>
              <SelectItem key={'previous_month'} value={'previous_month'}>
                Last month
              </SelectItem>
              <SelectItem key={'last_three_months'} value={'last_three_months'}>
                Last 3 months
              </SelectItem>
              <SelectItem key={'last_six_months'} value={'last_six_months'}>
                Last 6 months
              </SelectItem>
              <SelectItem key={'last_year'} value={'last_year'}>
                Last 12 months
              </SelectItem>
            </Select>
          </div>
          <div className="flex flex-col w-full min-h-[800px] lg:flex-row lg:min-h-[440px] p-4">
            <ExpenseCategoryPieChart />
            <ExpenseCategoryBarChart />
          </div>
        </Card>
      </section>
    </div>
  );
};
