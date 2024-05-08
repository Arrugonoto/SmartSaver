'use client';
import { useExpensesStore } from '@store/expensesStore';
import { useStore } from '@lib/hooks/useStore';
import { expenseCategoriesList } from '@lib/constants/data/dummy/expense-categories';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

const data01 = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
  { name: 'Group E', value: 278 },
  { name: 'Group F', value: 189 },
];

const categoriesWithoutInitial = expenseCategoriesList.slice(1);

type ChartElement = {
  name: string;
  quantity: number;
};

export const ExpenseCategoryPieChart = () => {
  const expenses = useStore(useExpensesStore, (state) => state.expenses);
  const [chartData, setChartdata] = useState<ChartElement[]>([]);

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
      };
    }
  });

  const filteredQuantity = qtyByCategory?.filter(
    (category) => category !== undefined
  ) as ChartElement[];

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            dataKey="quantity"
            // isAnimationActive={false}
            data={filteredQuantity}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
