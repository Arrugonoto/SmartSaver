'use client';
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

export const AnnualSpendingsBarChart = () => {
  const expenses = useStore(useExpensesStore, (state) => state.expenses);

  const chartData = months.map((month) => {
    //filter spendings for each month separately
    const eachMonthSpendings = expenses
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

  // {
  //    month: 'January',
  //    spendings: 3458
  // }

  return (
    <div className="h-[500px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
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
            dataKey="spendings"
            fill="#8884d8"
            activeBar={<Rectangle fill="pink" stroke="blue" />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
