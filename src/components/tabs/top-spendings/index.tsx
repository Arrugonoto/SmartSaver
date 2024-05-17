'use client';
import { Tabs, Tab } from '@nextui-org/tabs';
import { TopOverallSpendingsTable } from '@components/table/top-spendings/top-overall';
import { TopOneTimeSpendingsTable } from '@components/table/top-spendings/top-one-time';
import { TopSubscriptionsTable } from '@components/table/top-spendings/top-subscriptions';
import { useStore } from '@lib/hooks/useStore';
import { useExpensesStore } from '@store/expensesStore';
import type { Expense } from '@constants/types/expenses/expenses';

export const TopSpendingsTabs = () => {
  const expenses = useStore(
    useExpensesStore,
    (state) => state.expenses
  ) as Expense[];

  return (
    <Tabs
      aria-label="Options"
      className="flex w-full justify-center"
      size="sm"
      radius="lg"
    >
      <Tab key="overall" title="Overall" className="w-full">
        <TopOverallSpendingsTable expenses={expenses} />
      </Tab>
      <Tab key="one time" title="One Time" className="w-full">
        <TopOneTimeSpendingsTable expenses={expenses} />
      </Tab>
      <Tab key="subscriptions" title="Subscriptions" className="w-full">
        <TopSubscriptionsTable expenses={expenses} />
      </Tab>
    </Tabs>
  );
};
