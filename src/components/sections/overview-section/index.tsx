'use client';
import { useEffect } from 'react';
import type { Expense } from '@constants/types/expenses/expenses';
import { getExpenses } from '@lib/actions/expenses/get-expenses';
import { useFetch } from '@lib/hooks/useFetch';
import { useStore } from '@lib/hooks/useStore';
import { useExpensesStore } from '@store/expensesStore';
import { Card, CardBody } from '@nextui-org/card';
import { Tabs, Tab } from '@nextui-org/tabs';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from '@nextui-org/table';
import { AnnualSpendingsBarChart } from '@components/charts/annual-spendings-bar-chart';

export const OverviewSection = ({ user_id }: { user_id: string }) => {
  const setExpenses = useExpensesStore((state) => state.setExpenses);
  const setTotalResults = useExpensesStore((state) => state.setTotalResults);
  const { data, totalResults } = useFetch<Expense>({
    action: getExpenses,
    user_id,
  });
  const expenses = useStore(useExpensesStore, (state) => state.expenses);

  const columns = [
    {
      key: 'name',
      label: 'NAME',
    },
    {
      key: 'amount',
      label: 'AMOUNT',
    },
  ];

  const totalExpenses = expenses?.reduce(
    (sum, expense) => sum + parseFloat(expense.amount as any),
    0
  );

  const sortedExpenses = expenses
    ?.sort(
      (curr, next) =>
        parseFloat(next.amount as any) - parseFloat(curr.amount as any)
    )
    .slice(0, 10);

  const highestOneTimePayments = expenses
    ?.filter((expense) => expense.payment_type === 'one-time')
    .sort(
      (curr, next) =>
        parseFloat(next.amount as any) - parseFloat(curr.amount as any)
    )
    .slice(0, 10);

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
      <section className="flex flex-col w-full">
        <div className="flex gap-4">
          <Card className="max-w-[300px] w-full align-center justify-center">
            <CardBody className="gap-4">
              <h2 className="text-center text-xl">Total spendings</h2>
              <p className="text-center text-2xl">{totalExpenses}</p>
            </CardBody>
          </Card>
          <Card className="max-w-[300px] w-full align-center justify-center">
            <CardBody className="gap-4">
              <h2 className="text-center text-xl">Monthly commitments</h2>
              <p className="text-center text-2xl">{monthlyCommitments()}</p>
            </CardBody>
          </Card>
        </div>
      </section>
      <section className="">
        <Card className="flex items-center max-w-[620px] min-h-[320px] p-4 gap-2">
          <h2 className="text-xl">10 most expensive fees</h2>
          <Tabs aria-label="Options" className="w-auto" size="sm" radius="lg">
            <Tab key="overall" title="Overall" className="w-full">
              <Table aria-label="10 highest expenses">
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  )}
                </TableHeader>
                <TableBody items={sortedExpenses}>
                  {(item) => (
                    <TableRow key={item.id}>
                      {(columnKey) => (
                        <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Tab>
            <Tab key="one time" title="One Time" className="w-full">
              <Table aria-label="10 highest one time payments">
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  )}
                </TableHeader>
                <TableBody items={highestOneTimePayments}>
                  {(item) => (
                    <TableRow key={item.id}>
                      {(columnKey) => (
                        <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Tab>
            <Tab key="subscriptions" title="Subscriptions" className="w-full">
              <Table aria-label="10 highest subscriptions">
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  )}
                </TableHeader>
                <TableBody items={highestSubscriptions}>
                  {(item) => (
                    <TableRow key={item.id}>
                      {(columnKey) => (
                        <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Tab>
          </Tabs>
        </Card>
      </section>
      <section>
        <Card className="h-full w-full p-4">
          <AnnualSpendingsBarChart />
        </Card>
        <div>spendings bar chart by current and previous month</div>
        <div>spendings by category pie chart for current month</div>
      </section>
    </div>
  );
};
