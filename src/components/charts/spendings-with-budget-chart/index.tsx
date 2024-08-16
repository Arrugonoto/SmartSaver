'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@lib/hooks/useStore';
import { useExpensesStore } from '@store/expensesStore';
import { useSession } from 'next-auth/react';
import { useFetch } from '@lib/hooks/useFetch';
import { getBudgetLimit } from '@lib/actions/budget/get-budget-limit';
import type {
  Expenses,
  SingleExpense,
  Subscription,
} from '@constants/types/expenses/expenses';
import type { BudgetLimit } from '@lib/constants/types/budget/budget';
import { months } from '@lib/constants/data/dummy/months';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { LoadingChart } from '@components/loaders/loading-chart';

interface ChartElement {
  name: string;
  spendings: number;
  budget: number;
}

interface RawDataTypes {
  currentMonthSpendings: (SingleExpense | Subscription)[];
  lastMonthSpendings: (SingleExpense | Subscription)[];
}

const getCurrentMonthData = (data: Expenses, currentDate: Date) => {
  // function for filtering data based on expense creation and duration dates
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const filterSingleSpendings = data?.expenses
    .filter((expense) => expense.payment_type === 'one-time')
    .map((spending) => {
      const expenseDate = new Date(spending.created_at);
      const yearOfExpense = expenseDate.getFullYear();
      const monthOfExpense = expenseDate.getMonth();

      if (yearOfExpense === currentYear && monthOfExpense === currentMonth) {
        return spending;
      }
    })
    .filter((expense) => expense !== undefined);

  const filterMonthlySpendings = data?.expenses
    .filter((expense) => expense.payment_type === 'monthly')
    .map((spending) => {
      const startOfPayment = new Date(spending.created_at);
      const lastPayment = new Date(
        startOfPayment.setMonth(
          startOfPayment.getMonth() + spending.payment_duration!
        )
      );

      const lastPaymentDate = new Date(
        lastPayment.getFullYear(),
        lastPayment.getMonth()
      );

      if (lastPaymentDate >= new Date(currentYear, currentMonth))
        return spending;
    })
    .filter((spending) => spending !== undefined);

  const filterSubscriptions = data?.subscriptions
    .map((subscription) => {
      const startOfSub = new Date(subscription.created_at);
      const lastPayment = new Date(
        startOfSub.setMonth(
          startOfSub.getMonth() + subscription.payment_duration!
        )
      );

      const lastPaymentDate = new Date(
        lastPayment.getFullYear(),
        lastPayment.getMonth()
      );

      if (lastPaymentDate >= new Date(currentYear, currentMonth))
        return subscription;
    })
    .filter((subscription) => subscription !== undefined);

  return [
    ...filterSingleSpendings,
    ...filterMonthlySpendings,
    ...filterSubscriptions,
  ];
};

const getPreviousMonthData = (data: Expenses, currentDate: Date) => {
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  // get last month and last year as date
  const lastMonth = new Date(previousYear, previousMonth);

  const filterLastMonthSingleSpendings = data?.expenses
    .filter((expense) => expense.payment_type === 'one-time')
    .map((spending) => {
      const expenseDate = new Date(spending.created_at);
      const expenseMonthAndYear = new Date(
        expenseDate.getFullYear(),
        expenseDate.getMonth()
      );

      if (expenseMonthAndYear.getTime() === lastMonth.getTime()) {
        return spending;
      }
    })
    .filter((expense) => expense !== undefined);

  const filterLastMonthSpendings = data?.expenses
    .filter(
      (expense) =>
        expense.payment_type === 'monthly' &&
        new Date(
          new Date(expense.created_at).getFullYear(),
          new Date(expense.created_at).getMonth()
        ) <= lastMonth
    )
    .map((spending) => {
      const startOfPayment = new Date(spending.created_at);
      const lastPayment = new Date(
        startOfPayment.setMonth(
          startOfPayment.getMonth() + spending.payment_duration!
        )
      );

      const lastPaymentDate = new Date(
        lastPayment.getFullYear(),
        lastPayment.getMonth()
      );

      if (lastPaymentDate >= new Date(currentYear, currentMonth))
        return spending;
    })
    .filter((spending) => spending !== undefined);

  const filterLastMonthSubscriptions = data?.subscriptions
    .filter(
      (subscription) =>
        new Date(
          new Date(subscription.created_at).getFullYear(),
          new Date(subscription.created_at).getMonth()
        ) <= lastMonth
    )
    .map((subscription) => {
      const startOfSub = new Date(subscription.created_at);
      const lastPayment = new Date(
        startOfSub.setMonth(
          startOfSub.getMonth() + subscription.payment_duration!
        )
      );

      const lastPaymentDate = new Date(
        lastPayment.getFullYear(),
        lastPayment.getMonth()
      );

      if (lastPaymentDate >= new Date(currentYear, currentMonth))
        return subscription;
    })
    .filter((subscription) => subscription !== undefined);

  return [
    ...filterLastMonthSingleSpendings,
    ...filterLastMonthSpendings,
    ...filterLastMonthSubscriptions,
  ];
};

const formatChartData = (
  data: RawDataTypes,
  budgetLimit: number,
  currentDate: Date
) => {
  const currentMonth = currentDate.getMonth();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;

  const formattedData = Object.entries(data).map((entries) => {
    const totalSpendingsInMonth = entries[1].reduce(
      (sum: any, entry: any) => parseFloat(sum) + parseFloat(entry.amount),
      0
    );
    const monthName =
      entries[0] === 'currentMonthSpendings'
        ? months[currentMonth].name
        : months[lastMonth].name;

    return {
      name: monthName,
      spendings: totalSpendingsInMonth,
      budget: budgetLimit,
    };
  });
  console.log(formattedData);
  return formattedData.reverse() as ChartElement[];
};

export const SpendingsWithBudgetChart = () => {
  const spendings = useStore(useExpensesStore, (state) => state.spendings);
  const { data: session } = useSession();
  const user_id = session?.user.id;
  const [rawData, setRawData] = useState<RawDataTypes>({
    currentMonthSpendings: [],
    lastMonthSpendings: [],
  });
  const [chartData, setChartData] = useState<ChartElement[]>([]);
  const { data: budgetData } = useFetch<BudgetLimit>({
    action: getBudgetLimit,
    user_id,
    initialFetch: true,
  });

  useEffect(() => {
    const currentDate = new Date();
    if (spendings) {
      const currentMonthSpendings = getCurrentMonthData(spendings, currentDate);
      const lastMonthSpendings = getPreviousMonthData(spendings, currentDate);
      setRawData({ currentMonthSpendings, lastMonthSpendings });
    }
    //eslint-disable-next-line
  }, [spendings]);

  useEffect(() => {
    const currentDate = new Date();
    if (rawData.currentMonthSpendings.length > 0 && budgetData) {
      const data = formatChartData(
        rawData,
        budgetData.budget_limit,
        currentDate
      );
      setChartData(data);
    }
    //eslint-disable-next-line
  }, [spendings, budgetData]);

  if (!spendings || !budgetData) return <LoadingChart sm />;

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="px-4">
        <h3 className="font-medium text-lg">Expenses with budged</h3>
      </div>
      <div className="flex h-[260px] xs:h-[300px] sm:h-[400px]">
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
              fill="#3182bd"
              fillOpacity={0.8}
              radius={[4, 4, 0, 0]}
            />
            <Line type="monotone" dataKey="budget" stroke="#3bb900" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
