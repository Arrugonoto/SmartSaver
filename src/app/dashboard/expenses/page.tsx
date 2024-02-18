import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@app/api/auth/[...nextauth]/options';
import { CreateExpenseModal } from '@components/modals/create-expense-modal';

export const metadata: Metadata = {
   title: 'Expenses',
};

export default async function Expenses() {
   const session = await getServerSession(authOptions);
   const user_id = session?.user.id;

   return (
      <main className="flex flex-1 flex-col">
         <CreateExpenseModal user_id={user_id} />
      </main>
   );
}
