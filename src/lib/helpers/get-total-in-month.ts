import type { Expenses } from '@constants/types/expenses/expenses';

export const getTotalInMonth = (data: Expenses, currentDate: Date) => {
  // function for filtering data based on expense creation and duration dates
  // and returning total amount of spendings in month
  // tl;dr stable calc of spendings in current month
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // FIXME: Fix dates based on year and month instead of just a date with day, hour, etc.
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

  const expensesTotal = filterSingleSpendings.reduce(
    (sum, expense) => sum + parseFloat(expense.amount as any),
    0
  );

  const monthlyTotal = filterMonthlySpendings?.reduce(
    (sum, spending) => sum + parseFloat(spending?.amount as any),
    0
  );

  const subscriptionsTotal = filterSubscriptions.reduce(
    (sum, subscription) => sum + parseFloat(subscription?.amount as any),
    0
  );

  const totalInMonth = expensesTotal + monthlyTotal + subscriptionsTotal;
  const monthlyCommitments = monthlyTotal + subscriptionsTotal;

  return { totalInMonth, monthlyCommitments };
};
