'use client';
import { useState, useEffect } from 'react';
import type { Expense } from '@constants/types/expenses/expenses';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from '@nextui-org/table';

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

const sortHighestSubscriptions = (expenses: Expense[]) => {
  const highestSubscriptions = expenses
    ?.filter((expense) => expense.payment_type === 'subscription')
    .sort((a, b) => parseFloat(b.amount as any) - parseFloat(a.amount as any))
    .slice(0, 10);

  return highestSubscriptions;
};

export const TopSubscriptionsTable = ({
  expenses,
}: {
  expenses: Expense[];
}) => {
  const [tableData, setTableData] = useState<Expense[]>([]);

  useEffect(() => {
    if (expenses) {
      const data = sortHighestSubscriptions(expenses);
      setTableData(data);
    }
  }, [expenses]);

  return (
    <Table aria-label="10 highest subscriptions">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={tableData}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
