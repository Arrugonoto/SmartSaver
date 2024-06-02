import { useState, useEffect } from 'react';
import { useStore } from '@lib/hooks/useStore';
import { useExpensesStore } from '@store/expensesStore';
import { useSession } from 'next-auth/react';
import { useFetch } from '@lib/hooks/useFetch';
import { getBudgetLimit } from '@lib/actions/budget/get-budget-limit';
import type { Expense } from '@constants/types/expenses/expenses';
import type { BudgetLimit } from '@lib/constants/types/budget/budget';
import { months } from '@lib/constants/data/dummy/months';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  ResponsiveContainer,
} from 'recharts';

type ChartElement = {
  name: string;
  spendings: number;
  budget: number;
};

const data = [
  {
    name: 'Page A',
    uv: 590,
    pv: 800,
    amt: 1400,
    cnt: 490,
  },
  {
    name: 'Page B',
    uv: 868,
    pv: 967,
    amt: 1506,
    cnt: 590,
  },
  {
    name: 'Page C',
    uv: 1397,
    pv: 1098,
    amt: 989,
    cnt: 350,
  },
  {
    name: 'Page D',
    uv: 1480,
    pv: 1200,
    amt: 1228,
    cnt: 480,
  },
  {
    name: 'Page E',
    uv: 1520,
    pv: 1108,
    amt: 1100,
    cnt: 460,
  },
  {
    name: 'Page F',
    uv: 1400,
    pv: 680,
    amt: 1700,
    cnt: 380,
  },
];

const getCurrentMonthData = (data: Expense[]) => {
  // function for filtering data based on range of dates
  const currentDate = new Date();
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  // get first day of first month in range
  const startDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  const filteredData = data.filter((expense) => {
    const expenseDate = new Date(expense.created_at);
    // check if searched element is inside specified date range
    return expenseDate >= startDate && expenseDate <= lastDayOfMonth;
  });

  return filteredData;
};

const getPreviousMonthData = (data: Expense[]) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const startDate = new Date(previousMonthYear, previousMonth, 1);
  const endDate = new Date(previousMonthYear, previousMonth + 1, 0);

  return data.filter((item) => {
    const itemDate = new Date(item.created_at);
    return itemDate >= startDate && itemDate <= endDate;
  });
};

const formatChartData = (data: any[], budgetLimit: number) => {
  const formattedData = months.map((month) => {
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
      spendings: totalMonthlySpendings === 0 ? null : totalMonthlySpendings,
      budget: budgetLimit,
    };
  });

  console.log(formattedData);

  return formattedData?.filter((month) => month.spendings) as ChartElement[];
};

export const MonthlySpendingsChart = () => {
  const expenses = useStore(useExpensesStore, (state) => state.expenses);
  const { data: session } = useSession();
  const user_id = session?.user.id;
  const [rawData, setRawData] = useState<Expense[]>([]);
  const [chartData, setChartData] = useState<ChartElement[]>([]);

  const { data: budgetData } = useFetch<BudgetLimit>({
    action: getBudgetLimit,
    user_id,
  });

  useEffect(() => {
    if (expenses) {
      const currentMonth = getCurrentMonthData(expenses);
      const prevMonth = getPreviousMonthData(expenses);

      setRawData([...currentMonth, ...prevMonth]);
    }
  }, [expenses]);

  useEffect(() => {
    if (rawData.length > 0 && budgetData) {
      const data = formatChartData(rawData, budgetData.budget_limit);
      setChartData(data);
    }
  }, [rawData, budgetData]);

  return (
    <div className="min-h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          width={500}
          height={400}
          data={chartData}
          margin={{
            top: 20,
            right: 10,
            bottom: 20,
            left: 10,
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
          <Legend />
          <Bar
            dataKey="spendings"
            barSize={30}
            fill="#8884d8"
            radius={[4, 4, 0, 0]}
          />
          <Line type="monotone" dataKey="budget" stroke="#ff7300" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
