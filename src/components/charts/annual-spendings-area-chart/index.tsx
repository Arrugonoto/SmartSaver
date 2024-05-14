'use client';
import { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useExpensesStore } from '@store/expensesStore';
import { useStore } from '@lib/hooks/useStore';
import { Select, SelectItem } from '@nextui-org/select';

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

const formatChartData = (data: any[], year: string) => {
  const filteredByYear = data.filter((expense) =>
    expense.created_at.toString().includes(year)
  );

  const chartData = months.map((month) => {
    // filter spendings for each month separately
    // and filter empty values(undefined)
    const eachMonthSpendings = filteredByYear
      ?.map((expense) => {
        if (expense.created_at.toString().includes(month.abbreviation))
          return expense.amount;
      })
      .filter((amount) => amount !== undefined);

    // sum values for each month to return total spendings in month
    const totalMonthlySpendings = eachMonthSpendings?.reduce(
      (sum, amount) => parseFloat(sum as any) + parseFloat(amount as any),
      0
    );

    return {
      name: month.name,
      spendings: totalMonthlySpendings === 0 ? null : totalMonthlySpendings,
    };
  });

  return chartData as AnnualChartElement[];
};

const getYears = (data: any[]) => {
  const years = data?.map((expense) => {
    const createdAt = new Date(expense.created_at);
    return createdAt.getFullYear().toString();
  });
  const uniqYears = [...new Set(years)];
  console.log(uniqYears);
  return uniqYears as string[];
};

export const AnnualSpendingsAreaChart = () => {
  const expenses = useStore(useExpensesStore, (state) => state.expenses);
  const [chartData, setChartData] = useState<AnnualChartElement[]>([]);
  const [yearsOfData, setYearsOfData] = useState<string[]>([]);
  const [filteredYear, setFilteredYear] = useState<string>('2024');

  useEffect(() => {
    if (expenses) {
      const years = getYears(expenses);
      setYearsOfData(years);
    }
  }, [expenses]);

  useEffect(() => {
    if (expenses) {
      const data = formatChartData(expenses, filteredYear);

      setChartData(data);
    }
  }, [expenses, filteredYear]);

  return (
    <div className="w-full">
      <Select label="Select an animal" className="max-w-xs">
        {yearsOfData.map((year, index) => (
          <SelectItem key={index} value={year}>
            {year}
          </SelectItem>
        ))}
      </Select>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
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
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              labelStyle={{ color: '#000' }}
              contentStyle={{
                borderRadius: '0.3rem',
              }}
            />
            <Legend />
            <Area
              type="bumpX"
              name="Total in month"
              dataKey="spendings"
              fill="#3182bd"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
