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
import { getExpenses } from '@lib/actions/expenses/get-expenses';
import { useFetch } from '@lib/hooks/useFetch';

const columns = [
  { key: 'name', label: 'NAME' },
  { key: 'amount', label: 'AMOUNT' },
  { key: 'expense_type', label: 'EXPENSE TYPE' },
  { key: 'payment_type', label: 'PAYMENT TYPE' },
  { key: 'created_at', label: 'LAST UPDATE' },
  { key: 'actions', label: 'ACTIONS' },
];

//FIXME: ADD DESCRIPTION AS ACCORDION
export const ExpensesSection = ({ user_id }: { user_id: string }) => {
  const expenses = useExpensesStore((state) => state.expenses);
  const resultsPerPage = useExpensesStore((state) => state.resultsPerPage);
  const totalResults = useExpensesStore((state) => state.totalResults);
  const setExpenses = useExpensesStore((state) => state.setExpenses);
  const setTotalResults = useExpensesStore((state) => state.setTotalResults);
  const [page, setPage] = useState<number>(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });

  const {
    isLoading,
    data,
    error,
    totalResults: allResults,
  } = useFetch<Expense>({
    action: getExpenses,
    user_id,
  });

  const sortedData = useMemo(() => {
    const sorted = expenses.sort((a, b) => {
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

    return sorted;
  }, [sortDescriptor, expenses]);

  const paginatedData = sortedData.slice(
    (page - 1) * resultsPerPage,
    page * resultsPerPage
  );

  useEffect(() => {
    if (!isLoading && data) {
      setExpenses(data);
    }
  }, [isLoading, data, setExpenses]);

  useEffect(() => {
    if (!isLoading && allResults) {
      setTotalResults(allResults);
    }
  }, [isLoading, allResults, setTotalResults, data]);

  return (
    <section className="w-full flex-1">
      <div className="flex w-full flex-col h-full flex-1 gap-4 overflow-hidden">
        <Table
          aria-label="User related expenses table"
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
                  onChange={(page) => setPage(page)}
                />
              </div>
            )
          }
          onSortChange={(descriptor) => {
            setSortDescriptor(descriptor);
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
      </div>
    </section>
  );
};
