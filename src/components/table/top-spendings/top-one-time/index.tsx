'use client';
import { useState, useEffect } from 'react';
import type {
  Expenses,
  SingleExpense,
} from '@constants/types/expenses/expenses';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
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
];
const sortOneTimePayments = (spendings: Expenses) => {
  const highestOneTimePayments = spendings?.expenses
    ?.filter((expense) => expense.payment_type === 'one-time')
    .sort(
      (curr, next) =>
        parseFloat(next.amount as any) - parseFloat(curr.amount as any)
    )
    .slice(0, 10);

  return highestOneTimePayments;
};

export const TopOneTimeSpendingsTable = ({
  spendings,
}: {
  spendings: Expenses;
}) => {
  const [tableData, setTableData] = useState<SingleExpense[]>([]);

  useEffect(() => {
    if (spendings) {
      const data = sortOneTimePayments(spendings);
      setTableData(data);
    }
  }, [spendings]);

  return (
    <Table
      aria-label="10 highest one time payments"
      className="h-[300px]"
      isHeaderSticky
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={tableData}>
        {(item) => {
          const capitalizedName = capitalizeString(item.name);
          return (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === 'name'
                    ? capitalizedName
                    : getKeyValue(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          );
        }}
      </TableBody>
    </Table>
  );
};
