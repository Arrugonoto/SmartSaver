'use client';
import { expenseCategoriesList } from '@lib/constants/data/dummy/expense-categories';
import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useState, useEffect } from 'react';
import { chartIcons } from '@constants/icons';
import type {
  SingleExpense,
  Subscription,
} from '@constants/types/expenses/expenses';
import { LoadingChart } from '@components/loaders/loading-chart';
import { useWindowSize } from '@lib/hooks/useWindowSize';

const categoriesWithoutInitial = expenseCategoriesList.slice(1);

type ChartData = {
  name: string;
  quantity: number;
  percentageValue: number;
  color: string;
  single_spendings: number;
  monthly_payments: number;
  subscriptions: number;
};

const formatChartData = (expenses: (SingleExpense | Subscription)[]) => {
  const totalExpensesInRange = expenses.length;

  const qtyByCategory = categoriesWithoutInitial
    .map((category) => {
      const numOfFeesByCategory = expenses?.filter(
        (expense) => expense.expense_type === category.value
      );

      const numOfSpendings = numOfFeesByCategory.filter(
        (expense) => expense.payment_type === 'one-time'
      ).length;
      const numOfMonthlyPayments = numOfFeesByCategory.filter(
        (expense) => expense.payment_type === 'monthly'
      ).length;
      const numOfSubs = numOfFeesByCategory.filter(
        (expense) => expense.payment_type === 'subscription'
      ).length;

      const calculatedPercent = parseFloat(
        ((numOfFeesByCategory.length / totalExpensesInRange) * 100).toFixed(2)
      );

      if (numOfFeesByCategory && numOfFeesByCategory.length > 0) {
        return {
          name: category.label,
          percentageValue: calculatedPercent,
          quantity: numOfFeesByCategory.length,
          single_spendings: numOfSpendings,
          monthly_payments: numOfMonthlyPayments,
          subscriptions: numOfSubs,
          color: category.color,
        };
      }
    })
    .filter((category) => category !== undefined);

  return qtyByCategory as ChartData[];
};

export const ExpenseCategoryPieChart = ({
  expenses,
}: {
  expenses: (SingleExpense | Subscription)[];
}) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const { width } = useWindowSize();
  const chartInnerRadius = width > 1024 ? 64 : width > 768 ? 50 : 34;
  const chartOuterRadius = width > 1024 ? 90 : width > 768 ? 70 : 54;

  useEffect(() => {
    if (expenses) {
      const processedData = formatChartData(expenses);
      setChartData(processedData);
    }
  }, [expenses]);

  if (chartData.length === 0 || !expenses) {
    return <LoadingChart sm />;
  }

  return (
    <div className="flex flex-col w-full xl:w-1/2 justify-center">
      <h3 className="font-medium">Summary by category</h3>
      <div className="flex h-[500px] min-h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={500}>
            <Pie
              name="Spendings"
              data={chartData}
              dataKey="quantity"
              cx="50%"
              cy="50%"
              innerRadius={chartInnerRadius}
              outerRadius={chartOuterRadius}
              label
              paddingAngle={2}
            >
              {chartData?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`#${entry.color}`}
                  stroke="transparent"
                />
              ))}
            </Pie>

            <Legend
              iconType="rect"
              content={
                <ul className="flex gap-4 flex-wrap">
                  {chartData.map((entry, index) => (
                    <li
                      key={index}
                      style={{
                        display: 'flex',
                        gap: '0.2rem',
                        alignItems: 'center',
                        color: `#${entry.color}`,
                        whiteSpace: 'nowrap',
                        fontSize: '0.9rem',
                      }}
                    >
                      <chartIcons.square className="text-xs" />
                      {`${entry.name} - ${entry.percentageValue}%`}
                    </li>
                  ))}
                </ul>
              }
            />
            <Tooltip
              contentStyle={{
                borderRadius: '0.3rem',
              }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-neutral-100 p-4 rounded-md text-black">
                      {payload[0].payload.single_spendings > 0 && (
                        <div className="flex justify-between gap-4">
                          <p className="label">{`One time spendings:`}</p>
                          <p className="inline-flex min-w-4 justify-center">
                            {payload[0].payload.single_spendings}
                          </p>
                        </div>
                      )}
                      {payload[0].payload.monthly_payments > 0 && (
                        <div className="flex justify-between gap-4">
                          <p className="label">{`Monthly payments: `}</p>
                          <p className="inline-flex min-w-4 justify-center">
                            {payload[0].payload.monthly_payments}
                          </p>
                        </div>
                      )}
                      {payload[0].payload.subscriptions > 0 && (
                        <div className="flex justify-between gap-4">
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
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
