'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '@lib/hooks/useStore';
import { useExpensesStore } from '@store/expensesStore';
import type {
  Expenses,
  SingleExpense,
  Subscription,
} from '@constants/types/expenses/expenses';
import { filterLastMonthData } from '@lib/helpers/filter-last-month-spendings';
import { Card, CardHeader, CardBody } from '@nextui-org/card';
import { ExpenseCategoryPieChart } from '@components/charts/category-pie-chart';
import { ExpenseCategoryBarChart } from '@components/charts/category-bar-chart';
import { MonthRangeSelect } from '@components/select/select-month-range';
import { Divider } from '@nextui-org/divider';

const switchDateRange = (
  data: Expenses,
  dateRange: string,
  currentDate: Date
) => {
  switch (dateRange) {
    case 'current_month': {
      return filterByDateRange(data, 1);
    }
    case 'last_month': {
      return filterLastMonthData(data, currentDate);
    }
    case 'last_three_months': {
      return filterByDateRange(data, 3);
    }
    case 'last_six_months': {
      return filterByDateRange(data, 6);
    }
    case 'last_year': {
      return filterByDateRange(data, 12);
    }
    default: {
      return filterByDateRange(data, 1);
    }
  }
};

const filterByDateRange = (data: Expenses, monthsRange: number) => {
  // function for filtering data based on range of dates

  const currentDate = new Date();

  const startDateOfSearch = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - monthsRange + 1
  );

  const filterSingleSpendings = data.expenses
    .filter((expense) => expense.payment_type === 'one-time')
    .map((expense) => {
      const expenseDate = new Date(expense.created_at);
      const stableDate = new Date(
        expenseDate.getFullYear(),
        expenseDate.getMonth()
      );

      if (stableDate >= startDateOfSearch) return expense;
    })
    .filter((expense) => expense !== undefined);

  const filterMonthlySpendings = data.expenses
    .filter((expense) => expense.payment_type === 'monthly')
    .map((expense) => {
      const expenseDate = new Date(expense.created_at);
      const lastPaymentDate = new Date(
        expenseDate.setMonth(expenseDate.getMonth() + expense.payment_duration!)
      );
      const stableLastPaymentDate = new Date(
        lastPaymentDate.getFullYear(),
        lastPaymentDate.getMonth()
      );

      if (stableLastPaymentDate >= startDateOfSearch) return expense;
    })
    .filter((expense) => expense !== undefined);

  const filterSubscriptions = data?.subscriptions
    .map((subscription) => {
      const subscriptionDate = new Date(subscription.created_at);
      const lastPaymentDate = new Date(
        subscriptionDate.setMonth(
          subscriptionDate.getMonth() + subscription.payment_duration!
        )
      );
      const stableLastPaymentDate = new Date(
        lastPaymentDate.getFullYear(),
        lastPaymentDate.getMonth()
      );

      if (stableLastPaymentDate >= startDateOfSearch) return subscription;
    })
    .filter((subscription) => subscription !== undefined);

  return [
    ...filterSingleSpendings,
    ...filterMonthlySpendings,
    ...filterSubscriptions,
  ];
};

export const MonthlyChartsSection = () => {
  const spendings = useStore(useExpensesStore, (state) => state.spendings);
  const stableSpendings = useMemo(
    () => spendings,
    // eslint-disable-next-line
    [spendings?.expenses, spendings?.subscriptions]
  );
  const [dateRange, setDateRange] = useState<string>('current_month');
  const [dataByDates, setDataByDates] = useState<
    (SingleExpense | Subscription)[]
  >([]);

  const totalNumOfExpensesInRange = dataByDates.length;
  const OneTimeSpendings = dataByDates.filter(
    (expense) => expense.payment_type === 'one-time'
  );
  const numOfSubsAndMonthly = dataByDates?.filter(
    (expense) =>
      expense.payment_type === 'monthly' ||
      expense.payment_type === 'subscription'
  );

  useEffect(() => {
    const currentDate = new Date();
    if (
      stableSpendings &&
      (stableSpendings.expenses.length > 0 ||
        stableSpendings?.subscriptions.length > 0)
    ) {
      const data = switchDateRange(stableSpendings, dateRange, currentDate);
      if (data) {
        setDataByDates(data);
      }
    }
  }, [stableSpendings, dateRange]);

  return (
    <section>
      <Card className="flex flex-col w-full pt-2 px-1 lg:px-4 gap-4">
        <CardHeader>
          <div className="flex w-full justify-between items-center bg-content2 px-4 py-1 rounded-lg flex-col md:flex-row gap-8">
            <div>
              <MonthRangeSelect
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            </div>

            <div className="flex flex-col w-full">
              <div className="flex flex-row justify-between">
                <p>Total expenses: </p>
                <p>{totalNumOfExpensesInRange}</p>
              </div>
              <Divider />
              <div className="flex flex-row justify-between">
                <p>One time: </p>
                <p>{OneTimeSpendings?.length ?? 0}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Commitments: </p>
                <p>{numOfSubsAndMonthly?.length ?? 0}</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="w-full h-full gap-4">
          <div className="flex flex-col w-full min-h-[70vh] xl:min-h-[50vh] h-full gap-4 xl:flex-row">
            {/* <ExpenseCategoryPieChart expenses={dataByDates} />
            <ExpenseCategoryBarChart expenses={dataByDates} /> */}
          </div>
        </CardBody>
      </Card>
    </section>
  );
};
