'use client';
import { useState, useEffect } from 'react';
import type {
  Expenses,
  Subscription,
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

const sortHighestSubscriptions = (spendings: Expenses) => {
  const highestSubscriptions = spendings?.subscriptions
    ?.sort((a, b) => parseFloat(b.amount as any) - parseFloat(a.amount as any))
    .slice(0, 10);

  return highestSubscriptions;
};

export const TopSubscriptionsTable = ({
  spendings,
}: {
  spendings: Expenses;
}) => {
  const [tableData, setTableData] = useState<Subscription[]>([]);

  useEffect(() => {
    if (spendings) {
      const data = sortHighestSubscriptions(spendings);
      setTableData(data);
    }
  }, [spendings]);

  return (
    <Table
      aria-label="10 highest subscriptions"
      className="h-[300px]"
      isHeaderSticky
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={tableData} className="flex-1">
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
