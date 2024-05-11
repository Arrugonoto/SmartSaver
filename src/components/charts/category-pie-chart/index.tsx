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

const categoriesWithoutInitial = expenseCategoriesList.slice(1);

type ChartElement = {
  name: string;
  quantity: number;
  color: string;
};

const formatChartData = (expenses: any[]) => {
  const filteredByMonth = expenses?.filter((expense) =>
    expense.created_at.toString().includes('Apr')
  );

  const qtyByCategory = categoriesWithoutInitial.map((category) => {
    const numOfFeesByCategory = filteredByMonth?.filter(
      (expense) => expense.expense_type === category.value
    );

    if (numOfFeesByCategory && numOfFeesByCategory.length > 0) {
      return {
        name: category.label,
        quantity: numOfFeesByCategory.length,
        color: category.color,
      };
    }
  });

  return qtyByCategory?.filter(
    (category) => category !== undefined
  ) as ChartElement[];
};

export const ExpenseCategoryPieChart = () => {
  const expenses = useStore(useExpensesStore, (state) => state.expenses);
  const [chartData, setChartData] = useState<ChartElement[]>([]);

  useEffect(() => {
    if (expenses) {
      const processedData = formatChartData(expenses);
      setChartData(processedData);
    }
  }, [expenses]);
  console.log(categoriesWithoutInitial[0].color);
  return (
    <div className="flex h-[400px] w-full lg:w-2/5 justify-center">
      <ResponsiveContainer width="40%" height="100%">
        <PieChart width={300} height={400}>
          <Pie
            dataKey="quantity"
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {chartData?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`#${entry.color}`} />
            ))}
          </Pie>
          {/* <Pie
            dataKey="quantity"
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {chartData?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`#${entry.color}`} />
            ))}
          </Pie> */}
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
