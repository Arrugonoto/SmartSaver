import { ExpensesTable } from '@components/table/expenses-table';

export const ExpensesSection = () => {
  return (
    <section className="flex w-full h-full overflow-auto">
      <ExpensesTable />
    </section>
  );
};
