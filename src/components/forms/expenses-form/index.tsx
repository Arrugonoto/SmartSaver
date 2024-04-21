'use client';
import React, { useState } from 'react';
import { Select, SelectItem } from '@nextui-org/select';
import { Input } from '@nextui-org/input';
import { expenseCategoriesList } from '@lib/constants/data/dummy/expense-categories';
import { Expense } from '@constants/types/expenses/expenses';
import FormButton from '@components/buttons/FormButton';
import { createExpense } from '@lib/actions/expenses/create-expense';
import { Textarea } from '@nextui-org/input';

export const ExpensesForm = ({ user_id }: { user_id: string }) => {
  const [formData, setFormData] = useState<Omit<Expense, 'id' | 'created_at'>>({
    user_id: user_id,
    name: '',
    amount: 0,
    expense_type: '',
    payment_type: '',
    description: '',
  });

  const resetForm = () => {
    setFormData({
      user_id: user_id,
      name: '',
      amount: 0,
      expense_type: '',
      payment_type: '',
      description: '',
    });
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

    await createExpense(expenseData);
    resetForm();
  };

  return (
    <div className="flex p-2 rounded-md w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
        <Input
          type="text"
          name="name"
          label="Expense name"
          value={formData.name}
          isRequired
          onChange={(e) => handleChange(e)}
        />
        <Input
          type="number"
          name="amount"
          label="Expense amount"
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
          isRequired
          onChange={(e) => handleChange(e)}
        >
          <SelectItem key="" value={''}>
            Select type
          </SelectItem>
          <SelectItem key="one-time" value={'one-time'}>
            Single
          </SelectItem>
          <SelectItem key="monthly" value={'monthly'}>
            Monthly
          </SelectItem>
        </Select>
        <Textarea
          label="Description"
          placeholder="(optional)"
          name="description"
          value={formData.description}
          onChange={(e) => handleChange(e)}
        />
        <FormButton type="submit" color="primary">
          Create Expense
        </FormButton>
      </form>
    </div>
  );
};
