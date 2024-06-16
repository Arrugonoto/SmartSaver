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
import { months } from '@lib/constants/data/dummy/months';
import { SelectYearRange } from '@components/select/select-year-range';

type AnnualChartElement = {
  name: string;
  spendings: number;
};

type YearsOfData = {
  label: string;
  value: string;
};

const currentYear = new Date().getFullYear().toString();

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
  const [yearsOfData, setYearsOfData] = useState<YearsOfData[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>(currentYear);

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
      <div className="flex w-full justify-between items-center">
        <div className="px-4">
          <h3 className="font-medium text-lg">Annual summary of expenses</h3>
        </div>
        {yearsOfData.length > 0 && (
          <SelectYearRange yearsOfData={yearsOfData} />
          // <Select
          //   label="Select year"
          //   className="max-w-[200px]"
          //   disallowEmptySelection={true}
          //   startContent={<selectIcons.calendar />}
          //   selectedKeys={[`${selectedYear}`]}
          //   onChange={(e) => handleChange(e)}
          //   variant="bordered"
          //   size="sm"
          //   radius="md"
          //   classNames={{ label: 'pb-1' }}
          // >
          //   {yearsOfData.map((year) => (
          //     <SelectItem key={year.value} value={year.value}>
          //       {year.label}
          //     </SelectItem>
          //   ))}
          // </Select>
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
