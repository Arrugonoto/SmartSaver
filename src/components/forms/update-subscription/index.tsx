'use client';
import React, { useState } from 'react';
import { Input } from '@nextui-org/input';
import { ExpenseIdRequired } from '@constants/types/expenses/expenses';
import { expenseTypesList } from '@lib/constants/data/dummy/expense-categories';
import FormButton from '@components/buttons/FormButton';
import { updateExpense } from '@lib/actions/expenses/update-expense';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { Select, SelectItem } from '@nextui-org/select';
import { Divider } from '@nextui-org/divider';

export const UpdateSubscriptionForm = ({
  expense,
}: {
  expense: ExpenseIdRequired;
}) => {
  const [formData, setFormData] = useState<
    Omit<ExpenseIdRequired, 'user_id'> & { user_id?: string }
  >({
    id: expense.id,
    name: '',
    amount: expense.amount,
    expense_type: '',
    payment_type: 'subscription',
  });

  const resetForm = () => {
    setFormData((prev) => ({
      ...prev,
      name: '',
      amount: 0,
      expense_type: '',
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
    // sometime TS is a conversion hell, knows that 'amount' should be number but,
    // select makes it a string... I'm converting 'string to string' to be able to convert it to float...
    const { amount } = formData;
    const stringAmount = amount.toString();
    const expenseAmount = parseFloat(stringAmount);
    const expenseData = {
      ...formData,
      amount: expenseAmount,
    };

    await updateExpense(expenseData);
    resetForm();
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full pb-4">
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
        <Select
          label="Expense type"
          name="expense_type"
          placeholder="Select expense type"
          selectedKeys={[`${formData.expense_type}`]}
          disabledKeys={['']}
          isRequired
          onChange={(e) => handleChange(e)}
        >
          {expenseTypesList.map((expense) => (
            <SelectItem key={expense.value} value={expense.value}>
              {expense.label}
            </SelectItem>
          ))}
        </Select>
        <FormButton type="submit" color="primary">
          Add Subscription
        </FormButton>
      </form>
    </div>
  );
};
