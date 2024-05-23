'use client';
import React, { useState, useEffect } from 'react';
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
import { selectIcons } from '@constants/icons';

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
  const uniqYears = [...new Set(years)].map((year) => {
    return {
      label: year,
      value: year,
    };
  });
  return uniqYears as { label: string; value: string }[];
};

export const AnnualSpendingsAreaChart = () => {
  const expenses = useStore(useExpensesStore, (state) => state.expenses);
  const [chartData, setChartData] = useState<AnnualChartElement[]>([]);
  const [yearsOfData, setYearsOfData] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedYear, setSelectedYear] = useState<string>('2024');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  useEffect(() => {
    if (expenses) {
      const years = getYears(expenses);
      setYearsOfData(years);
    }
  }, [expenses]);

  useEffect(() => {
    if (expenses) {
      const data = formatChartData(expenses, selectedYear);

      setChartData(data);
    }
  }, [expenses, selectedYear]);

  return (
    <div className="flex flex-col w-full gap-12">
      <div className="flex w-full justify-center">
        {yearsOfData.length > 0 && (
          <Select
            label="Select year"
            className="max-w-[200px]"
            disallowEmptySelection={true}
            startContent={<selectIcons.calendar />}
            selectedKeys={[`${selectedYear}`]}
            onChange={(e) => handleChange(e)}
            variant="bordered"
            size="sm"
            radius="md"
            classNames={{ label: 'pb-1' }}
          >
            {yearsOfData.map((year) => (
              <SelectItem key={year.value} value={year.value}>
                {year.label}
              </SelectItem>
            ))}
          </Select>
        )}
      </div>

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
