'use client';
import { Tabs, Tab } from '@nextui-org/tabs';
import { TopOverallSpendingsTable } from '@components/table/top-spendings/top-overall';
import { TopOneTimeSpendingsTable } from '@components/table/top-spendings/top-one-time';
import { TopSubscriptionsTable } from '@components/table/top-spendings/top-subscriptions';
import { useStore } from '@lib/hooks/useStore';
import { useExpensesStore } from '@store/expensesStore';
import type { Expenses } from '@constants/types/expenses/expenses';

export const TopSpendingsTabs = () => {
  const spendings = useStore(
    useExpensesStore,
    (state) => state.spendings
  ) as Expenses;

  return (
    <Tabs
      aria-label="Options"
      className="flex w-full justify-center"
      size="sm"
      radius="lg"
    >
      <Tab key="overall" title="Overall" className="w-full">
        <TopOverallSpendingsTable spendings={spendings} />
      </Tab>
      <Tab key="one time" title="One Time" className="w-full">
        <TopOneTimeSpendingsTable spendings={spendings} />
      </Tab>
      <Tab key="subscriptions" title="Subscriptions" className="w-full">
        <TopSubscriptionsTable spendings={spendings} />
      </Tab>
    </Tabs>
  );
};
