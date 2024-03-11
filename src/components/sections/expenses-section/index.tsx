'use client';
import { useState, useEffect, useMemo } from 'react';
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
import { Skeleton } from '@nextui-org/skeleton';
import { useAsyncList } from '@react-stately/data';
import { getExpenses } from '@lib/actions/expenses/get-expenses';
import type { Expense } from '@constants/types/expenses/expenses';
import { format } from 'date-fns';

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
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [data, setData] = useState<Expense[]>([]);
   const [page, setPage] = useState<number>(1);
   const [totalPages, setTotalPages] = useState<number>(1);
   const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
      column: 'name',
      direction: 'ascending',
   });

   const fetchExpenses = async () => {
      setIsLoading(true);
      const results = await getExpenses(user_id, page);

      if (results.data) {
         console.log(results.data);
         setData(results.data);
         setTotalPages(results.totalPages);
      }

      setIsLoading(false);
   };

   const sortedData = useMemo(() => {
      const sortData = data.sort((a, b) => {
         const first = a[sortDescriptor.column as keyof Expense] as number;
         const next = b[sortDescriptor.column as keyof Expense] as number;
         const sortResult = first < next ? -1 : first > next ? 1 : 0;

         return sortDescriptor.direction === 'descending'
            ? -sortResult
            : sortResult;
      });

      return sortData;
   }, [sortDescriptor, data]);

   useEffect(() => {
      fetchExpenses();
      // eslint-disable-next-line
   }, [page]);

   return (
      <section className="w-full flex-1">
         <div className="flex w-full flex-col h-full flex-1 gap-4 overflow-hidden">
            <Table
               aria-label="User related expenses table"
               sortDescriptor={sortDescriptor}
               selectionMode="single"
               color="primary"
               bottomContent={
                  totalPages > 0 && (
                     <div className="flex w-full justify-center">
                        <Pagination
                           total={totalPages}
                           initialPage={1}
                           variant="faded"
                           showControls={true}
                           className="self-center"
                           onChange={page => setPage(page)}
                        />
                     </div>
                  )
               }
               onSortChange={setSortDescriptor}
            >
               <TableHeader columns={columns}>
                  {column => (
                     <TableColumn
                        key={column.key}
                        allowsSorting={column.key != 'actions'}
                     >
                        {column.label}
                     </TableColumn>
                  )}
               </TableHeader>
               <TableBody
                  items={sortedData}
                  emptyContent={
                     isLoading
                        ? ''
                        : "Currently You don't have any expenses to keep track on."
                  }
                  loadingContent={<Spinner />}
                  loadingState={isLoading ? 'loading' : 'idle'}
               >
                  {item => {
                     const date = item.updated_at
                        ? item.updated_at
                        : item.created_at!;
                     return (
                        <TableRow key={item.id}>
                           <TableCell>{item.name}</TableCell>
                           <TableCell>{item.amount}</TableCell>
                           <TableCell>{item.expense_type}</TableCell>
                           <TableCell>{item.payment_type}</TableCell>
                           <TableCell>
                              {format(date, 'dd MMM yyy, H:mm')}
                           </TableCell>
                           <TableCell>actions</TableCell>
                        </TableRow>
                     );
                  }}
               </TableBody>
            </Table>
         </div>
      </section>
   );
};
