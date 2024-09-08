'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { useExpensesStore } from '@store/expensesStore';
import { useStore } from '@lib/hooks/useStore';
import { expenseCategoriesList } from '@lib/constants/data/dummy/expense-categories';
import { paymentCategory } from '@lib/constants/data/dummy/payment-category';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  SortDescriptor,
} from '@nextui-org/table';
import { Pagination } from '@nextui-org/pagination';
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
import type {
  Expenses,
  SingleExpense,
  Subscription,
} from '@constants/types/expenses/expenses';
import { Spinner } from '@nextui-org/spinner';
import type { Selection } from '@nextui-org/react';
import { capitalizeString } from '@lib/helpers/capitalize';
import { LoadingTable } from '@components/loaders/loading-table';

const categoriesWithoutEmpty = expenseCategoriesList.slice(1);

//FIXME: ADD DESCRIPTION AS ACCORDION

const columns = [
  { key: 'name', label: 'NAME' },
  { key: 'amount', label: 'AMOUNT' },
  { key: 'expense_type', label: 'EXPENSE TYPE' },
  { key: 'payment_type', label: 'PAYMENT TYPE' },
  { key: 'payment_duration', label: 'PAYMENT DURATION' },
  { key: 'created_at', label: 'LAST CHANGE' },
  { key: 'actions', label: 'ACTIONS' },
];

export const ExpensesTable = () => {
  const spendings = useStore(useExpensesStore, (state) => state.spendings!);
  const resultsPerPage =
    useStore(useExpensesStore, (state) => state.resultsPerPage) ?? 20;
  const setResultsPerPage = useExpensesStore(
    (state) => state.setResultsPerPage
  );
  const [page, setPage] = useState<number>(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Selection>('all');
  const [selectedPayment, setSelectedPayment] = useState<Selection>('all');

  const sortedData = useMemo(() => {
    const expenses: (SingleExpense | Subscription)[] = [
      ...(spendings?.expenses ?? []),
      ...(spendings?.subscriptions ?? []),
    ];
    setIsLoading(true);
    const sorted = expenses?.sort((a, b) => {
      let first = a[
        sortDescriptor.column as keyof (SingleExpense | Subscription)
      ] as number | string;
      let next = b[
        sortDescriptor.column as keyof (SingleExpense | Subscription)
      ] as number | string;

      if (
        sortDescriptor.column !== 'amount' &&
        sortDescriptor.column !== 'created_at'
      ) {
        first = (first as string).toLowerCase();
        next = (next as string).toLowerCase();
      }

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
  }, [sortDescriptor, spendings?.expenses, spendings?.subscriptions]);

  const searchedData = useMemo(() => {
    let data: (SingleExpense | Subscription)[] = sortedData as (
      | SingleExpense
      | Subscription
    )[];

    if (sortedData && searchValue) {
      data = data.filter((expense) =>
        expense.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (
      selectedCategory !== 'all' &&
      Array.from(selectedCategory).length !== categoriesWithoutEmpty.length
    ) {
      data = data.filter((expense) =>
        Array.from(selectedCategory).includes(expense.expense_type)
      );
    }

    if (
      selectedPayment !== 'all' &&
      Array.from(selectedPayment).length !== paymentCategory.length
    ) {
      data = data.filter((expense) =>
        Array.from(selectedPayment).includes(expense.payment_type)
      );
    }

    return data;
  }, [searchValue, sortedData, selectedCategory, selectedPayment]);

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

  const handleSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const results = parseInt(e.target.value);
      setResultsPerPage(results);
    },
    [setResultsPerPage]
  );

  const onInputClear = useCallback(() => {
    setSearchValue('');
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
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
                aria-label="Expense Category"
                closeOnSelect={false}
                selectionMode="multiple"
                selectedKeys={selectedCategory}
                onSelectionChange={setSelectedCategory}
              >
                {categoriesWithoutEmpty.map((category) => (
                  <DropdownItem key={category.value} className="capitalize">
                    {category.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button variant="flat">Payment</Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Payment Category"
                closeOnSelect={false}
                selectionMode="multiple"
                selectedKeys={selectedPayment}
                onSelectionChange={setSelectedPayment}
              >
                {paymentCategory.map((payment) => (
                  <DropdownItem key={payment.value} className="capitalize">
                    {payment.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between">
          <p>
            Total spendings:{' '}
            {(spendings?.expenses?.length as number) +
              (spendings?.subscriptions?.length as number)}
          </p>
          <Select
            disallowEmptySelection
            size="md"
            label="Rows per page"
            name="expense_type"
            labelPlacement="outside-left"
            selectedKeys={[`${resultsPerPage}`]}
            onChange={(e) => handleSelectChange(e)}
            className="max-w-[220px] whitespace-nowrap items-center"
          >
            <SelectItem key={'10'}>10</SelectItem>
            <SelectItem key={'20'}>20</SelectItem>
            <SelectItem key={'30'}>30</SelectItem>
            <SelectItem key={'50'}>50</SelectItem>
          </Select>
        </div>
      </div>
    );
  }, [
    searchValue,
    handleSearchChange,
    onInputClear,
    selectedCategory,
    selectedPayment,
    resultsPerPage,
    handleSelectChange,
    spendings?.expenses,
    spendings?.subscriptions,
  ]);

  const bottomContent = useMemo(() => {
    const totalElements =
      (spendings?.expenses.length as number) +
        (spendings?.subscriptions.length as number) || 0;
    const resultsInfo =
      totalElements &&
      `${1 + (page - 1) * resultsPerPage} - ${
        page * resultsPerPage < totalElements
          ? page * resultsPerPage
          : totalElements
      } of ${totalElements}`;

    return (
      <div className="flex w-1/2 justify-between">
        {totalElements && (
          <span className="text-default-400 text-sm">{resultsInfo}</span>
        )}

        {totalElements && (
          <Pagination
            isCompact
            showControls
            showShadow
            disableAnimation={false}
            disableCursorAnimation={false}
            total={Math.ceil(
              ((spendings?.expenses?.length as number) +
                (spendings?.subscriptions?.length as number)) /
                resultsPerPage
            )}
            initialPage={1}
            onChange={(page) => handlePageChange(page)}
            className="self-center"
          />
        )}
      </div>
    );
  }, [resultsPerPage, page, spendings]);

  // CONDITIONAL CHECK
  if (!paginatedData || !spendings) {
    return <LoadingTable />;
  }

  return (
    <Table
      aria-label="User related expenses table"
      isHeaderSticky
      sortDescriptor={sortDescriptor}
      selectionMode="single"
      color="primary"
      topContent={topContent}
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      onSortChange={(descriptor) => {
        setSortDescriptor(descriptor);
      }}
      classNames={{
        base: 'overflow-y-hidden',
      }}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.key}
            allowsSorting={
              column.key !== 'actions' && column.key !== 'payment_duration'
            }
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

          const capitalizedName = capitalizeString(item.name);

          const paymentType =
            item.payment_type === 'one-time'
              ? 'One time'
              : item.payment_type === 'subscription'
              ? 'Subscription'
              : 'Monthly';

          const paymentDuration = item.payment_duration
            ? `${item.payment_duration} ${
                item.payment_duration > 1 ? 'months' : 'month'
              }`
            : '-';

          return (
            <TableRow key={item.id}>
              <TableCell>{capitalizedName}</TableCell>
              <TableCell>{item.amount}</TableCell>
              <TableCell>{expenseType}</TableCell>
              <TableCell>{paymentType}</TableCell>
              <TableCell>{paymentDuration}</TableCell>
              <TableCell>{format(date, 'dd MMM yyy, H:mm')}</TableCell>
              <TableCell>
                <DropdownTable expense={item} />
              </TableCell>
            </TableRow>
          );
        }}
      </TableBody>
    </Table>
  );
};
