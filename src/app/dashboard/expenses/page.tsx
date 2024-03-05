import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/options';
import { CreateExpenseModal } from '@components/modals/create-expense-modal';
import { ExpensesSection } from '@components/sections/expenses-section';

export const metadata: Metadata = {
   title: 'Expenses',
};

export default async function Expenses() {
   const session = await getServerSession(authOptions);
   const user_id = session?.user.id;

   return (
      <main className="flex flex-1 flex-col px-4 py-2">
         <div className="flex flex-col gap-4">
            <div className="flex justify-between">
               <h1>Expenses</h1>
               <CreateExpenseModal user_id={user_id} />
            </div>

            <ExpensesSection user_id={user_id} />
         </div>
      </main>
   );
}
