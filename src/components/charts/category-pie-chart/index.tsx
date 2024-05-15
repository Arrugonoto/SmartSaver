'use client';
import { useExpensesStore } from '@store/expensesStore';
import { useStore } from '@lib/hooks/useStore';
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

const categoriesWithoutInitial = expenseCategoriesList.slice(1);

type ChartData = {
  name: string;
  quantity: number;
  percentageValue: number;
  color: string;
};

const formatChartData = (expenses: any[]) => {
  const filteredByMonth = expenses?.filter((expense) =>
    expense.created_at.toString().includes('Apr')
  );
  const totalExpensesInRange = filteredByMonth.length;

  const qtyByCategory = categoriesWithoutInitial.map((category) => {
    const numOfFeesByCategory = filteredByMonth?.filter(
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

export const ExpenseCategoryPieChart = () => {
  const expenses = useStore(useExpensesStore, (state) => state.expenses);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (expenses) {
      const processedData = formatChartData(expenses);
      setChartData(processedData);
    }
  }, [expenses]);

  return (
    <div className="flex flex-col min-h-[400px] w-full lg:w-2/5 justify-center">
      <h3>Number of spendings</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            name="Spendings"
            data={chartData}
            dataKey="quantity"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            label
            paddingAngle={4}
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
              <ul className="flex gap-2 flex-wrap">
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
                    <chartIcons.square />
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
