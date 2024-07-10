import { Metadata } from 'next';
import { ExpensesSection } from '@components/sections/expenses-section';
import { Suspense } from 'react';
import { Skeleton } from '@nextui-org/skeleton';
import { CreateExpenseModal } from '@components/modals/create-expense-modal';

export const metadata: Metadata = {
  title: 'Expenses',
};

export default async function Expenses() {
  return (
    <main className="flex flex-col w-full h-full px-4 py-2">
      <div className="flex flex-col h-full gap-4 py-2 px-4">
        <div className="flex justify-between">
          <h1>My expenses</h1>
          <CreateExpenseModal />
        </div>
        <Suspense fallback={<Skeleton className="w-full h-full rounded-lg" />}>
          <ExpensesSection />
        </Suspense>
      </div>
    </main>
  );
}
