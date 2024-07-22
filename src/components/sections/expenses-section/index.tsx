import { ExpensesTable } from '@components/table/expenses-table';

export const ExpensesSection = () => {
  return (
    <section className="flex h-full overflow-auto overflow-x-auto">
      <ExpensesTable />
    </section>
  );
};
