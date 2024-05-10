'use client';
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
import { useState, useEffect } from 'react';

const categoriesWithoutInitial = expenseCategoriesList.slice(1);

type ChartElement = {
  name: string;
  totalSpending: number;
  color: string;
};

const formatChartData = (expenses: any[]) => {
  const filteredByMonth = expenses?.filter((expense) =>
    expense.created_at.toString().includes('Apr')
  );

  const qtyByCategory = categoriesWithoutInitial.map((category) => {
    const expensesByCategory = filteredByMonth
      ?.map((expense) => {
        if (expense.expense_type === category.value) return expense.amount;
      })
      .filter((amount) => amount !== undefined);

    const totalInMonth = expensesByCategory.reduce(
      (sum, amount) => parseFloat(sum as any) + parseFloat(amount as any),
      0
    );

    if (expensesByCategory && expensesByCategory.length > 0) {
      return {
        name: category.label,
        totalSpending: totalInMonth,
        color: category.color,
      };
    }
  });

  return qtyByCategory?.filter(
    (category) => category !== undefined
  ) as ChartElement[];
};

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export const ExpenseCategoryBarChart = () => {
  const expenses = useStore(useExpensesStore, (state) => state.expenses);
  const [chartData, setChartData] = useState<ChartElement[]>([]);

  useEffect(() => {
    if (expenses) {
      const data = formatChartData(expenses);
      setChartData(data);
    }
  }, [expenses]);

  return (
    <div className="flex h-[400px] w-full lg:w-3/5">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
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
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar
            name="Total"
            dataKey="totalSpending"
            label={{ position: 'top' }}
            fill="#8884d8"
            activeBar={<Rectangle fill="pink" stroke="blue" />}
            radius={[4, 4, 0, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`#${entry.color}`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
