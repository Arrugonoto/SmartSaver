import { Metadata } from 'next';
import { ExpensesForm } from '@/components/forms/expenses-form';

export const metadata: Metadata = {
   title: 'Expenses',
};

export default function Expenses() {
   return (
      <main className="flex flex-1 flex-col">
         <div className="flex p-4">
            <ExpensesForm />
         </div>
      </main>
   );
}
