import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/options';
import { CreateExpenseModal } from '@components/modals/create-expense-modal';
import { ExpensesSection } from '@components/sections/expenses-section';
import { Suspense } from 'react';
import Loading from './loading';

export const metadata: Metadata = {
  title: 'Expenses',
};

export default async function Expenses() {
  const session = await getServerSession(authOptions);
  const user_id = session?.user.id;

  return (
    <main className="flex w-full flex-1 flex-col px-4 py-2">
      <div className="flex flex-col gap-4 flex-1 py-2">
        <div className="flex justify-between">
          <h1>My expenses</h1>
          <CreateExpenseModal user_id={user_id} />
        </div>
        <Suspense fallback={<Loading />}>
          <ExpensesSection user_id={user_id} />
        </Suspense>
      </div>
    </main>
  );
}
