'use client';
import { useStore } from '@lib/hooks/useStore';
import { useExpensesStore } from '@store/expensesStore';
import type { Expense } from '@constants/types/expenses/expenses';
import { Card, CardHeader, CardBody } from '@nextui-org/card';
import { ExpenseCategoryPieChart } from '@components/charts/category-pie-chart';
import { ExpenseCategoryBarChart } from '@components/charts/category-bar-chart';
import { Select, SelectItem } from '@nextui-org/select';
import { selectIcons } from '@constants/icons';

export const MonthlyChartsSection = () => {
  const expenses = useStore(useExpensesStore, (state) => state.expenses);

  const totalNumOfExpensesInMonth = expenses?.filter(
    (expense: Expense) =>
      expense.created_at.toString().includes('Apr') ||
      expense.payment_type.toLocaleLowerCase().includes('monthly') ||
      expense.payment_type.toLowerCase().includes('subscription')
  ).length;

  return (
    <section>
      <Card className="flex flex-col w-full px-4 pt-4 gap-4">
        <CardBody className="w-full">
          <div className="flex w-full justify-between">
            <p>Total number of expenses: {totalNumOfExpensesInMonth}</p>
            <Select
              label="Select date range"
              variant="bordered"
              defaultSelectedKeys={['current_month']}
              disallowEmptySelection={true}
              size="md"
              className="max-w-xs"
              startContent={<selectIcons.calendarEmpty />}
            >
              <SelectItem key={'current_month'} value={'current_month'}>
                Current month
              </SelectItem>
              <SelectItem key={'previous_month'} value={'previous_month'}>
                Last month
              </SelectItem>
              <SelectItem key={'last_three_months'} value={'last_three_months'}>
                Last 3 months
              </SelectItem>
              <SelectItem key={'last_six_months'} value={'last_six_months'}>
                Last 6 months
              </SelectItem>
              <SelectItem key={'last_year'} value={'last_year'}>
                Last 12 months
              </SelectItem>
            </Select>
          </div>
          <div className="flex flex-col w-full min-h-[800px] lg:flex-row lg:min-h-[440px] p-4">
            <ExpenseCategoryPieChart />
            <ExpenseCategoryBarChart />
          </div>
        </CardBody>
      </Card>
    </section>
  );
};
