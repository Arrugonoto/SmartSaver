import { Expenses } from '@lib/constants/types/expenses/expenses';

export const calcTotalExpensesSoFar = (spendings: Expenses) => {
  // declare arrays which will hold values of total spendings, and subscriptions so far of monthly payments

  const singleSpendings = spendings?.expenses.filter(
    (expense) => expense.payment_type === 'one-time'
  );

  const monthlySpendings = spendings?.expenses.filter(
    (expense) => expense.payment_type === 'monthly'
  );

  const calcMonthlySoFar = monthlySpendings.map((expense) => {
    // Calculate difference in month from start of payment, to current date
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const startYear = new Date(expense.created_at).getFullYear();
    const startMonth = new Date(expense.created_at).getMonth();

    const yearDiff = (currentYear - startYear) * 12; // multiply year with 12 months
    const monthDiff = currentMonth - startMonth + 1; // payment always starts from first month, add 1 to include first payment on start

    const totalMonthDiff = yearDiff + monthDiff;

    if (totalMonthDiff <= (expense.payment_duration as number)) {
      return totalMonthDiff * parseFloat(expense.amount as any);
    } else
      return (
        (expense.payment_duration as number) * parseFloat(expense.amount as any)
      );
  });

  const calcSubscriptionsSoFar = spendings.subscriptions.map((subscription) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const startYear = new Date(subscription.created_at).getFullYear();
    const startMonth = new Date(subscription.created_at).getMonth();

    const yearDiff = (currentYear - startYear) * 12;
    const monthDiff = currentMonth - startMonth + 1;

    const totalMonthDiff = yearDiff + monthDiff;

    if (totalMonthDiff <= (subscription.payment_duration as number)) {
      return totalMonthDiff * parseFloat(subscription.amount as any);
    } else
      return (
        (subscription.payment_duration as number) *
        parseFloat(subscription.amount as any)
      );
  });

  const totalSingle = singleSpendings.reduce(
    (sum, expense) => sum + parseFloat(expense.amount as any),
    0
  );

  const totalMonthly = calcMonthlySoFar.reduce(
    (sum, amount) => sum + amount,
    0
  );

  const totalSubscriptions = calcSubscriptionsSoFar.reduce(
    (sum, amount) => sum + amount,
    0
  );

  const totalSpendingsSoFar = totalSingle + totalMonthly + totalSubscriptions;
  return totalSpendingsSoFar;
};
