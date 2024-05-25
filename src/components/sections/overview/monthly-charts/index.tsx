'use client';
import React, { useState, useEffect } from 'react';
import { useStore } from '@lib/hooks/useStore';
import { useExpensesStore } from '@store/expensesStore';
import type { Expense } from '@constants/types/expenses/expenses';
import { Card, CardHeader, CardBody } from '@nextui-org/card';
import { ExpenseCategoryPieChart } from '@components/charts/category-pie-chart';
import { ExpenseCategoryBarChart } from '@components/charts/category-bar-chart';
import { Select, SelectItem } from '@nextui-org/select';
import { selectIcons } from '@constants/icons';

const switchDateRange = (data: Expense[], dateRange: string) => {
  switch (dateRange) {
    case 'current_month': {
      return filterByDateRange(data, 1);
    }
    case 'last_month': {
      return getPreviousMonthData(data);
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

const filterByDateRange = (data: Expense[], monthsRange: number) => {
  // function for filtering data based on range of dates
  const currentDate = new Date();
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  // get first day of first month in range
  const startDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - monthsRange + 1,
    1
  );

  const filteredData = data.filter((expense) => {
    const expenseDate = new Date(expense.created_at);
    // check if searched element is inside specified date range
    return expenseDate >= startDate && expenseDate <= lastDayOfMonth;
  });

  return filteredData;
};

const getPreviousMonthData = (data: Expense[]) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const startDate = new Date(previousMonthYear, previousMonth, 1);
  const endDate = new Date(previousMonthYear, previousMonth + 1, 0);

  return data.filter((item) => {
    const itemDate = new Date(item.created_at);
    return itemDate >= startDate && itemDate <= endDate;
  });
};

export const MonthlyChartsSection = () => {
  const expenses = useStore(useExpensesStore, (state) => state.expenses);
  const [dateRange, setDateRange] = useState<string>('current_month');
  const [dataByDates, setDataByDates] = useState<Expense[]>([]);

  const totalNumOfExpensesInMonth = dataByDates.length;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateRange(e.target.value);
  };

  useEffect(() => {
    if (expenses) {
      const data = switchDateRange(expenses, dateRange);
      console.log(data);
      setDataByDates(data);
    }
  }, [expenses, dateRange]);

  return (
    <section>
      <Card className="flex flex-col w-full px-4 pt-4 gap-4">
        <CardBody className="w-full">
          <div className="flex w-full justify-between">
            <p>Total number of expenses: {totalNumOfExpensesInMonth}</p>
            <Select
              label="Select date range"
              variant="bordered"
              defaultSelectedKeys={['current_month']}
              disallowEmptySelection={true}
              size="md"
              className="max-w-xs"
              startContent={<selectIcons.calendarEmpty />}
              onChange={(e) => handleChange(e)}
            >
              <SelectItem key={'current_month'} value={'current_month'}>
                Current month
              </SelectItem>
              <SelectItem key={'last_month'} value={'last_month'}>
                Last month
              </SelectItem>
              <SelectItem key={'last_three_months'} value={'last_three_months'}>
                Last 3 months
              </SelectItem>
              <SelectItem key={'last_six_months'} value={'last_six_months'}>
                Last 6 months
              </SelectItem>
              <SelectItem key={'last_year'} value={'last_year'}>
                Last 12 months
              </SelectItem>
            </Select>
          </div>
          <div className="flex flex-col w-full min-h-[800px] lg:flex-row lg:min-h-[440px] p-4">
            <ExpenseCategoryPieChart expenses={dataByDates} />
            <ExpenseCategoryBarChart expenses={dataByDates} />
          </div>
        </CardBody>
      </Card>
    </section>
  );
};
