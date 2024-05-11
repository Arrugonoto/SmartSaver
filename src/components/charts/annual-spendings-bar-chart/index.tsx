'use client';
import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useExpensesStore } from '@store/expensesStore';
import { useStore } from '@lib/hooks/useStore';

type AnnualChartElement = {
  name: string;
  spendings: number;
};

const months = [
  { name: 'January', abbreviation: 'Jan', numeric: '01' },
  { name: 'February', abbreviation: 'Feb', numeric: '02' },
  { name: 'March', abbreviation: 'Mar', numeric: '03' },
  { name: 'April', abbreviation: 'Apr', numeric: '04' },
  { name: 'May', abbreviation: 'May', numeric: '05' },
  { name: 'June', abbreviation: 'June', numeric: '06' },
  { name: 'July', abbreviation: 'July', numeric: '07' },
  { name: 'August', abbreviation: 'Aug', numeric: '08' },
  { name: 'September', abbreviation: 'Sept', numeric: '09' },
  { name: 'October', abbreviation: 'Oct', numeric: '10' },
  { name: 'November', abbreviation: 'Nov', numeric: '11' },
  { name: 'December', abbreviation: 'Dec', numeric: '12' },
];

const formatChartData = (data: any[]) => {
  const chartData = months.map((month) => {
    //filter spendings for each month separately
    const eachMonthSpendings = data
      ?.map((expense) => {
        if (expense.created_at.toString().includes(month.abbreviation))
          return expense.amount;
      })
      .filter((amount) => amount !== undefined);

    const totalMonthlySpendings = eachMonthSpendings?.reduce(
      (sum, amount) => parseFloat(sum as any) + parseFloat(amount as any),
      0
    );

    return {
      name: month.name,
      spendings: totalMonthlySpendings,
    };
  });

  return chartData as AnnualChartElement[];
};

export const AnnualSpendingsBarChart = () => {
  const expenses = useStore(useExpensesStore, (state) => state.expenses);
  const [chartData, setChartData] = useState<AnnualChartElement[]>([]);

  useEffect(() => {
    if (expenses) {
      const data = formatChartData(expenses);
      setChartData(data);
    }
  }, [expenses]);

  return (
    <div className="h-[400px] w-full">
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
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            name="Total in month"
            dataKey="spendings"
            fill="#8884d8"
            activeBar={<Rectangle stroke="#000" />}
            radius={[4, 4, 0, 0]}
            barSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
