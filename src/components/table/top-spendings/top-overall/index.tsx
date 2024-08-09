'use client';
import { useState, useEffect } from 'react';
import type {
  Expenses,
  SingleExpense,
  Subscription,
} from '@constants/types/expenses/expenses';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/table';
import { capitalizeString } from '@lib/helpers/capitalize';

const columns = [
  {
    key: 'name',
    label: 'NAME',
  },
  {
    key: 'amount',
    label: 'AMOUNT',
  },
  { key: 'payment_type', label: 'PAYMENT TYPE' },
];

const sortExpensesByHighest = (spendings: Expenses) => {
  const spendingsList = [...spendings?.expenses, ...spendings?.subscriptions];

  const sortedExpenses = spendingsList
    ?.sort(
      (curr, next) =>
        parseFloat(next.amount as any) - parseFloat(curr.amount as any)
    )
    .slice(0, 10);

  return sortedExpenses;
};

export const TopOverallSpendingsTable = ({
  spendings,
}: {
  spendings: Expenses;
}) => {
  const [tableData, setTableData] = useState<SingleExpense[] | Subscription[]>(
    []
  );

  useEffect(() => {
    if (spendings) {
      const data = sortExpensesByHighest(spendings);
      setTableData(data);
    }
  }, [spendings]);

  return (
    <Table
      aria-label="10 highest expenses"
      className="h-[300px]"
      isHeaderSticky
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={tableData}>
        {(item) => {
          const paymentType =
            item.payment_type === 'one-time'
              ? 'One time'
              : item.payment_type === 'subscription'
              ? 'Subscription'
              : 'Monthly payment';

          const capitalizedName = capitalizeString(item.name);

          return (
            <TableRow key={item.id}>
              <TableCell>{capitalizedName}</TableCell>
              <TableCell>{item.amount}</TableCell>
              <TableCell>{paymentType}</TableCell>
            </TableRow>
          );
        }}
      </TableBody>
    </Table>
  );
};
