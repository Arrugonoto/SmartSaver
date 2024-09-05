'use client';
import React, { useState, useEffect } from 'react';
import { Input } from '@nextui-org/input';
import { Subscription } from '@constants/types/expenses/expenses';
import { expenseCategoriesList } from '@lib/constants/data/dummy/expense-categories';
import FormButton from '@components/buttons/FormButton';
import { createExpense } from '@lib/actions/expenses/create-expense';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { Select, SelectItem } from '@nextui-org/select';
import { Divider } from '@nextui-org/divider';
import { useExpensesStore } from '@store/expensesStore';
import { useFetch } from '@lib/hooks/useFetch';
import { getExpenses } from '@lib/actions/expenses/get-expenses';
import { useSession } from 'next-auth/react';
import type { Expenses } from '@constants/types/expenses/expenses';

export const SubscriptionForm = ({ user_id }: { user_id: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<
    Omit<Subscription, 'id' | 'created_at'>
  >({
    user_id: user_id,
    name: '',
    amount: 0,
    expense_type: '',
    payment_type: 'subscription',
    payment_duration: 0,
    description: '',
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

  const resetForm = () => {
    setFormData((prev) => ({
      ...prev,
      name: '',
      amount: 0,
      expense_type: '',
      payment_duration: 0,
      description: '',
    }));
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
    // select element makes it a string... I'm converting 'string to string' to be able to convert it to float...
    const { amount, payment_duration } = formData;
    const stringAmount = amount.toString();
    const duration = payment_duration.toString();
    const expenseAmount = parseFloat(stringAmount);
    const expenseDuration = parseInt(duration);
    const expenseData = {
      ...formData,
      amount: expenseAmount,
      payment_duration: expenseDuration,
    };

    await createExpense(expenseData);
    resetForm();

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
    <div className="w-full">
      <Accordion variant="shadow">
        <AccordionItem
          key="expense-subscription"
          aria-label="Accordion subscription form"
          title="Fill form or select from list"
        >
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 w-full pb-4"
          >
            <Input
              type="text"
              name="name"
              label="Subscription name"
              value={formData.name}
              isRequired
              onChange={(e) => handleChange(e)}
            />
            <Input
              type="number"
              name="amount"
              label="Subscription amount"
              value={formData.amount.toString()}
              step="0.01"
              min={1}
              isRequired
              onChange={(e) => handleChange(e)}
            />
            <Input
              type="number"
              name="payment_duration"
              label="Duration(months)"
              value={formData.payment_duration.toString()}
              step="1"
              min={1}
              isRequired
              onChange={(e) => handleChange(e)}
            />
            <Select
              label="Expense type"
              name="expense_type"
              placeholder="Select expense type"
              selectedKeys={[`${formData.expense_type}`]}
              disabledKeys={['']}
              isRequired
              onChange={(e) => handleChange(e)}
            >
              {expenseCategoriesList.map((expense) => (
                <SelectItem key={expense.value} value={expense.value}>
                  {expense.label}
                </SelectItem>
              ))}
            </Select>
            <FormButton type="submit" color="primary" loading={isLoading}>
              {isLoading ? '' : 'Add Subscription'}
            </FormButton>
          </form>
        </AccordionItem>
      </Accordion>
      <Divider className="my-4" />
      <div>
        <p className="text-center">List of popular subscriptions</p>
      </div>
    </div>
  );
};
