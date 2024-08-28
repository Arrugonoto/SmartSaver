'use client';
import React, { useState, useEffect, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useExpensesStore } from '@store/expensesStore';
import { useStore } from '@lib/hooks/useStore';
import { months } from '@lib/constants/data/dummy/months';
import { SelectYearRange } from '@components/select/select-year-range';
import { LoadingChart } from '@components/loaders/loading-chart';
import {
  Expenses,
  SingleExpense,
  Subscription,
} from '@lib/constants/types/expenses/expenses';

interface AnnualChartElement {
  name: string;
  single_payments: number;
  monthly_payments: number;
  subscriptions: number;
  total_expenses: number;
}

interface YearsOfData {
  label: string;
  value: string;
}

interface DataByYear {
  single_spendings: SingleExpense[];
  monthly_spendings: SingleExpense[];
  subscriptions: Subscription[];
}

const formatChartData = (data: DataByYear, selectedYear: string) => {
  const chartData = months.map((month) => {
    // filter spendings for each month separately
    // and filter empty values (undefined)
    const dateToCompare = new Date(parseInt(selectedYear), month.numeric);

    const singleSpendingsInMonth = data.single_spendings.filter(
      (expense) => new Date(expense.created_at).getMonth() === month.numeric
    );

    // return data based on years and months
    const recurringPayments = data.monthly_spendings
      .map((expense) => {
        const startDate = new Date(
          new Date(expense.created_at).getFullYear(),
          new Date(expense.created_at).getMonth()
        );
        const endDate = new Date(expense.created_at);
        endDate.setMonth(endDate.getMonth() + (expense.payment_duration! - 1));

        if (endDate >= dateToCompare && dateToCompare >= startDate) {
          return expense;
        }
      })
      .filter((expense) => expense !== undefined);

    const subscriptionsInMonth = data.subscriptions
      .map((subscription) => {
        const startDate = new Date(
          new Date(subscription.created_at).getFullYear(),
          new Date(subscription.created_at).getMonth()
        );
        const endDate = new Date(subscription.created_at);
        endDate.setMonth(
          endDate.getMonth() + (subscription.payment_duration! - 1)
        );

        if (endDate >= dateToCompare && dateToCompare >= startDate) {
          return subscription;
        }
      })
      .filter((subscription) => subscription !== undefined);

    const spendingsInMonth = [
      ...singleSpendingsInMonth,
      ...recurringPayments,
      ...subscriptionsInMonth,
    ];

    const totalInMonth = spendingsInMonth.reduce(
      (sum, spending) =>
        parseFloat(sum as any) + parseFloat(spending.amount as any),
      0
    );

    return {
      name: month.name,
      single_payments: singleSpendingsInMonth.length,
      monthly_payments: recurringPayments.length,
      subscriptions: subscriptionsInMonth.length,
      total_expenses: totalInMonth === 0 ? null : totalInMonth,
    };
  });

  return chartData as AnnualChartElement[];
};

const getYearsOfData = (data: Expenses) => {
  const yearsByExpenses = data?.expenses
    .filter((expense) => expense.payment_type === 'one-time')
    .map((expense) => {
      const dateOfCreation = new Date(expense.created_at);
      return dateOfCreation.getFullYear().toString();
    });

  const yearsByMonthlyPayments = data?.expenses
    .filter((expense) => expense.payment_type === 'monthly')
    .map((expense) => {
      const startDate = new Date(expense.created_at);
      const endDate = new Date(expense.created_at);
      endDate.setMonth(endDate.getMonth() + expense.payment_duration!);

      const years = Array.from(
        { length: endDate.getFullYear() - startDate.getFullYear() + 1 },
        (_, i) => (startDate.getFullYear() + i).toString()
      );

      return years;
    });

  const yearsBySubscriptions = data?.subscriptions.map((subscription) => {
    const startDate = new Date(subscription.created_at);
    const endDate = new Date(subscription.created_at);
    endDate.setMonth(endDate.getMonth() + subscription.payment_duration!);

    const years = Array.from(
      { length: endDate.getFullYear() - startDate.getFullYear() + 1 },
      (_, i) => (startDate.getFullYear() + i).toString()
    );

    return years;
  });

  const arrayOfYears = [
    ...new Set(yearsByExpenses),
    ...new Set(yearsByMonthlyPayments.flat()),
    ...new Set(yearsBySubscriptions.flat()),
  ];

  const uniqYears = [...new Set(arrayOfYears)].map((year) => {
    return {
      label: year,
      value: year,
    };
  });

  return uniqYears as { label: string; value: string }[];
};

const filterDataByYear = (spendings: Expenses, selectedYear: string) => {
  const singleSpendings = spendings.expenses
    .filter((expense) => expense.payment_type === 'one-time')
    .filter(
      (expense) =>
        new Date(expense.created_at).getFullYear().toString() === selectedYear
    );

  const monthlySpendings = spendings.expenses
    .filter((expense) => expense.payment_type === 'monthly')
    .map((expense) => {
      const startDate = new Date(expense.created_at);
      const endDate = new Date(
        startDate.setMonth(startDate.getMonth() + expense.payment_duration!)
      );

      if (endDate.getFullYear() >= parseInt(selectedYear)) {
        return expense;
      }
    })
    .filter((expense) => expense !== undefined);

  const subscriptions = spendings.subscriptions
    .map((subscription) => {
      const startDate = new Date(subscription.created_at);
      const endDate = new Date(
        startDate.setMonth(
          startDate.getMonth() + subscription.payment_duration!
        )
      );

      if (endDate.getFullYear() >= parseInt(selectedYear)) {
        return subscription;
      }
    })
    .filter((subscription) => subscription !== undefined);
  return {
    single_spendings: singleSpendings,
    monthly_spendings: monthlySpendings,
    subscriptions: subscriptions,
  };
};

export const AnnualSpendingsAreaChart = () => {
  const spendings = useStore(useExpensesStore, (state) => state.spendings);
  const stableSpendings = useMemo(
    () => spendings,
    // eslint-disable-next-line
    [spendings?.expenses, spendings?.subscriptions]
  );
  const [chartData, setChartData] = useState<AnnualChartElement[]>([]);
  const [yearOfData, setYearOfData] = useState<YearsOfData[]>([]);
  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState<string>(currentYear);

  useEffect(() => {
    if (
      stableSpendings &&
      (stableSpendings.expenses.length > 0 ||
        stableSpendings.subscriptions.length > 0)
    ) {
      const years = getYearsOfData(stableSpendings);
      setYearOfData(years);
    }
  }, [stableSpendings]);

  useEffect(() => {
    if (stableSpendings) {
      const filteredData = filterDataByYear(stableSpendings, selectedYear);
      const data = formatChartData(filteredData, selectedYear);
      setChartData(data);
    }
  }, [stableSpendings, selectedYear]);

  if (!stableSpendings || chartData.length === 0) {
    return <LoadingChart />;
  }

  return (
    <div className="flex flex-col w-full gap-12">
      <div className="flex w-full justify-between items-center">
        <div className="px-4">
          <h3 className="font-medium text-lg">Annual summary of expenses</h3>
        </div>
        {yearOfData.length > 0 && (
          <SelectYearRange
            yearOfData={yearOfData}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
          />
        )}
      </div>

      <div className="flex h-[260px] xs:h-[300px] sm:h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={400}
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Legend />
            <Area
              type="bumpX"
              name="Total in month"
              dataKey="total_expenses"
              fill="#3182bd"
              fillOpacity={0.2}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '0.3rem',
              }}
              labelStyle={{ color: '#000' }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-neutral-100 p-4 rounded-md text-black">
                      <div className="flex">
                        <p className="w-full text-center">
                          {payload[0].payload.name}
                        </p>
                      </div>
                      <div className="flex justify-between gap-4">
                        <p className="text-[#3182bd]">
                          Total in month: {payload[0].payload.total_expenses}
                        </p>
                      </div>
                      {payload[0].payload.single_payments > 0 && (
                        <div className="flex justify-between gap-4 text-sm">
                          <p className="label">{`One time payments:`}</p>
                          <p className="inline-flex min-w-4 justify-center ">
                            {payload[0].payload.single_payments}
                          </p>
                        </div>
                      )}
                      {payload[0].payload.monthly_payments > 0 && (
                        <div className="flex justify-between gap-4 text-sm">
                          <p className="label">{`Monthly payments: `}</p>
                          <p className="inline-flex min-w-4 justify-center">
                            {payload[0].payload.monthly_payments}
                          </p>
                        </div>
                      )}
                      {payload[0].payload.subscriptions > 0 && (
                        <div className="flex justify-between gap-4 text-sm">
                          <p className="label">{`Subscriptions:`}</p>
                          <p className="inline-flex min-w-4 justify-center">
                            {payload[0].payload.subscriptions}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                }

                return null;
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
