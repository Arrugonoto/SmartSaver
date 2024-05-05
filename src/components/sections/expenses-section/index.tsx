'use client';
import { useState, useEffect, useMemo, Suspense } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  SortDescriptor,
} from '@nextui-org/table';
import { Spinner } from '@nextui-org/spinner';
import {
  Pagination,
  PaginationItem,
  PaginationCursor,
} from '@nextui-org/pagination';
import type { Expense } from '@constants/types/expenses/expenses';
import { format } from 'date-fns';
import { DropdownTable } from '@components/dropdowns/dropdown-table';
import { tableIcons } from '@constants/icons';
import { expenseCategoriesList } from '@lib/constants/data/dummy/expense-categories';
import { useExpensesStore } from '@store/expensesStore';
import { useStore } from '@lib/hooks/useStore';

const columns = [
  { key: 'name', label: 'NAME' },
  { key: 'amount', label: 'AMOUNT' },
  { key: 'expense_type', label: 'EXPENSE TYPE' },
  { key: 'payment_type', label: 'PAYMENT TYPE' },
  { key: 'created_at', label: 'LAST CHANGE' },
  { key: 'actions', label: 'ACTIONS' },
];

//FIXME: ADD DESCRIPTION AS ACCORDION
export const ExpensesSection = ({ user_id }: { user_id: string }) => {
  const expenses = useStore(useExpensesStore, (state) => state.expenses);
  const resultsPerPage =
    useStore(useExpensesStore, (state) => state.resultsPerPage) ?? 20;
  const totalResults = useStore(
    useExpensesStore,
    (state) => state.totalResults
  );
  const [page, setPage] = useState<number>(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const sortedData = useMemo(() => {
    setIsLoading(true);
    const sorted = expenses?.sort((a, b) => {
      let first = a[sortDescriptor.column as keyof Expense] as number | string;
      let next = b[sortDescriptor.column as keyof Expense] as number | string;
      if (sortDescriptor.column === 'amount') {
        first = parseFloat(first as any);
        next = parseFloat(next as any);
      }
      const sortResult = first < next ? -1 : first > next ? 1 : 0;

      return sortDescriptor.direction === 'descending'
        ? -sortResult
        : sortResult;
    });

    setIsLoading(false);
    return sorted;
  }, [sortDescriptor, expenses]);

  if (!totalResults) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  const paginatedData = sortedData?.slice(
    (page - 1) * resultsPerPage,
    page * resultsPerPage
  );

  const handlePageChange = (page: number) => {
    setIsLoading(true);
    setPage(page);
    setIsLoading(false);
  };

  return (
    <section className="flex w-full h-full overflow-auto">
      <Table
        aria-label="User related expenses table"
        isHeaderSticky
        sortDescriptor={sortDescriptor}
        selectionMode="single"
        color="primary"
        bottomContent={
          totalResults > 0 && (
            <div className="flex w-full justify-center">
              <Pagination
                total={Math.ceil(totalResults / 20)}
                initialPage={1}
                variant="faded"
                showControls={true}
                className="self-center"
                onChange={(page) => handlePageChange(page)}
              />
            </div>
          )
        }
        bottomContentPlacement="outside"
        onSortChange={(descriptor) => {
          setSortDescriptor(descriptor);
        }}
        classNames={{
          base: 'overflow-hidden',
          wrapper: 'bg-red-400',
          table: '',
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              allowsSorting={column.key != 'actions'}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody
          items={paginatedData}
          emptyContent={
            isLoading
              ? ''
              : "Currently You don't have any expenses to keep track on."
          }
          loadingContent={<Spinner />}
          loadingState={isLoading ? 'loading' : 'idle'}
        >
          {(item) => {
            const date = item.updated_at ? item.updated_at : item.created_at!;
            const expenseType = expenseCategoriesList.map((el) => {
              if (el.value === item.expense_type) return el.label;
            });

            return (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.amount}</TableCell>
                <TableCell>{expenseType}</TableCell>
                <TableCell>{item.payment_type}</TableCell>
                <TableCell>{format(date, 'dd MMM yyy, H:mm')}</TableCell>
                <TableCell>
                  <DropdownTable expense={item} />
                </TableCell>
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
    </section>
  );
};
