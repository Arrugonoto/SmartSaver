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
import type { Selection } from '@nextui-org/react';
import { expenseCategoriesList } from '@lib/constants/data/dummy/expense-categories';
import { paymentCategory } from '@lib/constants/data/dummy/payment-category';
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

const categoriesWithoutEmpty = expenseCategoriesList.slice(1);

//FIXME: ADD DESCRIPTION AS ACCORDION
export const ExpensesSection = () => {
  const expenses = useStore(useExpensesStore, (state) => state.expenses);
  const resultsPerPage =
    useStore(useExpensesStore, (state) => state.resultsPerPage) ?? 20;
  const totalResults = useStore(
    useExpensesStore,
    (state) => state.totalResults
  );
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
    let data: Expense[] = sortedData as Expense[];

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

  console.log(totalResults);

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
            <Button color="primary">Add New</Button>
          </div>
        </div>
        <div className="flex justify-between">
          <p>Total spendings: {totalResults}</p>
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
    totalResults,
    resultsPerPage,
    handleSelectChange,
  ]);

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
                total={Math.ceil(totalResults / resultsPerPage)}
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
          base: 'overflow-y-hidden',
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
