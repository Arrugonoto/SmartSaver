'use client';
import { useState, useEffect } from 'react';
import { useExpensesStore } from '@store/expensesStore';
import { useStore } from '@lib/hooks/useStore';
import { expenseCategoriesList } from '@lib/constants/data/dummy/expense-categories';
import {
  Legend,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import type {
  SingleExpense,
  Subscription,
} from '@constants/types/expenses/expenses';
import { LoadingChart } from '@components/loaders/loading-chart';

const categoriesWithoutInitial = expenseCategoriesList.slice(1);

type ChartElement = {
  name: string;
  totalSpending: number;
  color: string;
};

const formatChartData = (expenses: (SingleExpense | Subscription)[]) => {
  const qtyByCategory = categoriesWithoutInitial.map((category) => {
    const expensesByCategory = expenses
      ?.map((expense) => {
        if (expense.expense_type === category.value) return expense.amount;
      })
      .filter((amount) => amount !== undefined);

    const totalInMonth = expensesByCategory
      .reduce(
        (sum, amount) => parseFloat(sum as any) + parseFloat(amount as any),
        0
      )
      ?.toFixed(2);

    if (expensesByCategory && expensesByCategory.length > 0) {
      return {
        name: category.label,
        totalSpending: parseFloat(totalInMonth),
        color: category.color,
      };
    }
  });

  return qtyByCategory?.filter(
    (category) => category !== undefined
  ) as ChartElement[];
};

export const ExpenseCategoryBarChart = ({
  expenses,
}: {
  expenses: (SingleExpense | Subscription)[];
}) => {
  const [chartData, setChartData] = useState<ChartElement[]>([]);

  useEffect(() => {
    if (expenses) {
      const data = formatChartData(expenses);
      setChartData(data);
    }
  }, [expenses]);

  if (chartData.length === 0 || !expenses) {
    return <LoadingChart sm />;
  }

  return (
    <div className="flex flex-col w-full xg:w-1/2 gap-8">
      <h3 className="font-medium">Total by category</h3>
      <div className="flex h-[260px] xs:h-[300px] sm:h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={500}
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
            <Tooltip
              labelStyle={{ color: '#000' }}
              contentStyle={{
                borderRadius: '0.3rem',
              }}
            />
            <Bar
              name="Total"
              dataKey="totalSpending"
              fill="#8884d8"
              activeBar={<Rectangle stroke="#000" />}
              radius={[4, 4, 0, 0]}
              barSize={30}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`#${entry.color}`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
