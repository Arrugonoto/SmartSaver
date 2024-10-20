import { Expenses } from '@lib/constants/types/expenses/expenses';
import type {
  SingleExpense,
  Subscription,
} from '@lib/constants/types/expenses/expenses';

export const filterCurrentMonthData = (data: Expenses, currentDate: Date) => {
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
    ...(filterSingleSpendings as SingleExpense[]),
    ...(filterMonthlySpendings as SingleExpense[]),
    ...(filterSubscriptions as Subscription[]),
  ];
};
