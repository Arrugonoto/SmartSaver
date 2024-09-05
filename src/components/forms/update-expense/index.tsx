'use client';
import React, { useState, useEffect } from 'react';
import { Select, SelectItem } from '@nextui-org/select';
import { Input } from '@nextui-org/input';
import { expenseCategoriesList } from '@lib/constants/data/dummy/expense-categories';
import { ExpenseIdRequired } from '@constants/types/expenses/expenses';
import FormButton from '@components/buttons/FormButton';
import { updateExpense } from '@lib/actions/expenses/update-expense';
import { Textarea } from '@nextui-org/input';
import { useExpensesStore } from '@store/expensesStore';
import { useFetch } from '@lib/hooks/useFetch';
import { getExpenses } from '@lib/actions/expenses/get-expenses';
import { useSession } from 'next-auth/react';
import type { Expenses } from '@constants/types/expenses/expenses';

export const UpdateExpenseForm = ({
  expense,
}: {
  expense: ExpenseIdRequired;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<
    Omit<ExpenseIdRequired, 'user_id' | 'created_at'>
  >({
    id: expense.id,
    name: expense.name,
    amount: expense.amount,
    expense_type: expense.expense_type,
    payment_type: expense.payment_type,
    description: expense.description || '',
    payment_duration: expense.payment_duration,
  });
  const { data: session } = useSession();
  const { setSpendings, spendings, setTotalResults } = useExpensesStore(
    (state) => ({
      spendings: state.spendings,
      setSpendings: state.setSpendings,
      setTotalResults: state.setTotalResults,
    })
  );

  const { fetchData, data, totalResults } = useFetch<Expenses>({
    action: getExpenses,
    user_id: session?.user.id,
  });

  const handleManualFetch = () => {
    if (session?.user.id) {
      fetchData(session?.user.id);
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // sometime TS is a conversion hell, knows that 'amount' should be number but,
    // select makes it a string... I'm converting 'string to string' to be able to convert it to float...
    const { amount, payment_duration } = formData;
    const stringAmount = amount.toString();
    const duration = payment_duration?.toString();
    const expenseAmount = parseFloat(stringAmount);
    let expenseDuration = null;

    if (duration) {
      expenseDuration = parseInt(duration);
    }

    if (!expenseDuration) {
      const expenseData = {
        ...formData,
        amount: expenseAmount,
      };
      await updateExpense(expenseData);
    }

    if (expenseDuration) {
      const expenseData = {
        ...formData,
        amount: expenseAmount,
        payment_duration: expenseDuration,
      };
      await updateExpense(expenseData);
    }

    handleManualFetch();
    setIsLoading(false);
  };

  useEffect(() => {
    if (data) {
      setSpendings(data);
      setTotalResults(totalResults);
    }
  }, [data, totalResults, setSpendings, setTotalResults]);

  return (
    <div className="flex p-2 rounded-md w-full">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col gap-3 w-full"
      >
        <Input
          type="text"
          name="name"
          label="Expense name"
          placeholder={expense.name}
          value={formData.name}
          onChange={(e) => handleChange(e)}
        />
        <Input
          type="number"
          name="amount"
          label="Expense amount"
          placeholder={`${expense.amount || '0'}`}
          value={formData.amount.toString()}
          step="0.01"
          min={1}
          onChange={(e) => handleChange(e)}
        />
        <Select
          label="Expense type"
          name="expense_type"
          placeholder="Select expense type"
          selectedKeys={[`${formData.expense_type}`]}
          disabledKeys={['']}
          onChange={(e) => handleChange(e)}
        >
          {expenseCategoriesList.map((expense) => (
            <SelectItem key={expense.value} value={expense.value}>
              {expense.label}
            </SelectItem>
          ))}
        </Select>
        <Select
          label="Payment type"
          name="payment_type"
          placeholder="Select payment type"
          selectedKeys={[`${formData.payment_type}`]}
          disabledKeys={['']}
          onChange={(e) => handleChange(e)}
        >
          <SelectItem key="" value={''}>
            Select type
          </SelectItem>
          <SelectItem key="one-time" value={'one-time'}>
            One time payment
          </SelectItem>
          <SelectItem key="monthly" value={'monthly'}>
            Monthly
          </SelectItem>
        </Select>
        <Input
          isDisabled={formData.payment_type !== 'monthly'}
          type="number"
          name="payment_duration"
          label="Duration(months)"
          value={formData?.payment_duration?.toString()}
          step="1"
          min={1}
          isRequired
          onChange={(e) => handleChange(e)}
        />
        <Textarea
          label="Description"
          placeholder={expense.description || 'description of expense'}
          name="description"
          value={formData.description}
          onChange={(e) => handleChange(e)}
        />
        <FormButton type="submit" color="primary" loading={isLoading}>
          {isLoading ? '' : 'Update'}
        </FormButton>
      </form>
    </div>
  );
};
