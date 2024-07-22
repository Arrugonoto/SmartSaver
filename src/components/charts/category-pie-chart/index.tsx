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
import type { Expense } from '@constants/types/expenses/expenses';
import { LoadingChart } from '@components/loaders/loading-chart';

const categoriesWithoutInitial = expenseCategoriesList.slice(1);

type ChartData = {
  name: string;
  quantity: number;
  percentageValue: number;
  color: string;
};

const formatChartData = (expenses: Expense[]) => {
  const totalExpensesInRange = expenses.length;

  const qtyByCategory = categoriesWithoutInitial.map((category) => {
    const numOfFeesByCategory = expenses?.filter(
      (expense) => expense.expense_type === category.value
    );

    const calculatedPercent = parseFloat(
      ((numOfFeesByCategory.length / totalExpensesInRange) * 100).toFixed(2)
    );

    if (numOfFeesByCategory && numOfFeesByCategory.length > 0) {
      return {
        name: category.label,
        percentageValue: calculatedPercent,
        quantity: numOfFeesByCategory.length,
        color: category.color,
      };
    }
  });

  return qtyByCategory?.filter(
    (category) => category !== undefined
  ) as ChartData[];
};

export const ExpenseCategoryPieChart = ({
  expenses,
}: {
  expenses: Expense[];
}) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);

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
    <div className="flex flex-col min-h-[500px] w-full xl:w-1/2 justify-center">
      <h3 className="font-medium">Summary by category</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={500}>
          <Pie
            name="Spendings"
            data={chartData}
            dataKey="quantity"
            cx="50%"
            cy="50%"
            innerRadius={64}
            outerRadius={90}
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
                    <p className="label">{`Spendings : ${payload[0].value}`}</p>
                  </div>
                );
              }

              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
