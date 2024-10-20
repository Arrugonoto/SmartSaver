import { Expenses } from '@lib/constants/types/expenses/expenses';
import type {
  SingleExpense,
  Subscription,
} from '@lib/constants/types/expenses/expenses';

export const filterLastMonthData = (data: Expenses, currentDate: Date) => {
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
    ...(filterLastMonthSingleSpendings as SingleExpense[]),
    ...(filterLastMonthSpendings as SingleExpense[]),
    ...(filterLastMonthSubscriptions as Subscription[]),
  ];
};
