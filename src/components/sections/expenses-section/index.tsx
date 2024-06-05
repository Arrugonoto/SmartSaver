'use client';
import React, { useState, useMemo, useCallback } from 'react';
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
import {
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/dropdown';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Select, SelectItem } from '@nextui-org/select';
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
export const ExpensesSection = () => {
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
  const [searchValue, setSearchValue] = useState<string>('');

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

  const searchedData = useMemo(() => {
    let data: Expense[] = [];
    if (sortedData && sortedData.length > 0) {
      data = [...sortedData];
    }

    if (sortedData && searchValue) {
      data = sortedData?.filter((expense) =>
        expense.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    return data;
  }, [searchValue, sortedData]);

  const paginatedData = searchedData?.slice(
    (page - 1) * resultsPerPage,
    page * resultsPerPage
  );

  const handlePageChange = (page: number) => {
    setIsLoading(true);
    setPage(page);
    setIsLoading(false);
  };

  const handleSearchChange = useCallback((value?: string) => {
    if (value) {
      setSearchValue(value);
      setPage(1);
    } else {
      setSearchValue('');
    }
  }, []);

  const onInputClear = React.useCallback(() => {
    setSearchValue('');
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            type="search"
            className="w-full max-w-[200px]"
            placeholder="Search by name..."
            value={searchValue}
            onValueChange={handleSearchChange}
            onClear={() => onInputClear}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button variant="flat">Category</Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectionMode="multiple"
              >
                <DropdownItem className="capitalize"></DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button variant="flat">Payment</Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectionMode="multiple"
              >
                <DropdownItem className="capitalize"></DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Button color="primary">Add New</Button>
          </div>
        </div>
        <Select
          label="Results per page"
          name="expense_type"
          disabledKeys={['']}
        >
          {expenseCategoriesList.map((expense) => (
            <SelectItem key={expense.value} value={expense.value}>
              {expense.label}
            </SelectItem>
          ))}
        </Select>
      </div>
    );
  }, [searchValue, handleSearchChange, onInputClear]);

  if (!totalResults) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <section className="flex w-full h-full overflow-auto">
      <Table
        aria-label="User related expenses table"
        isHeaderSticky
        sortDescriptor={sortDescriptor}
        selectionMode="single"
        color="primary"
        topContent={topContent}
        bottomContent={
          totalResults &&
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

            const paymentType =
              item.payment_type === 'one-time'
                ? 'One time'
                : item.payment_type === 'subscription'
                ? 'Subscription'
                : 'Monthly';

            return (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.amount}</TableCell>
                <TableCell>{expenseType}</TableCell>
                <TableCell>{paymentType}</TableCell>
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
