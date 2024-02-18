'use client';
import React, { useState } from 'react';
import { Select, SelectItem } from '@nextui-org/select';
import { Input } from '@nextui-org/input';
import { expenseTypesList } from '@data/dummy/expenses-types';
import { Expense } from '@constants/types/expenses/expenses';
import FormButton from '@components/buttons/FormButton';
import { createExpense } from '@lib/actions/expenses/create-expense';

export const ExpensesForm = ({ user_id }: { user_id: string }) => {
   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const amountValue = formData.get('amount') as string;
      const amount = amountValue ? parseInt(amountValue) : 0;
      const expenseData = { ...Object.fromEntries(formData), amount };
      console.log(expenseData);

      const newExpense = {
         user_id,
         ...expenseData,
      } as Expense;
      console.log(newExpense);

      await createExpense(newExpense);
   };

   return (
      <div className="flex p-2 rounded-md">
         <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
            <Input type="text" name="name" label="Expense name" />
            <Input type="number" name="amount" label="Expense amount" min={1} />
            <Select
               label="Expense type"
               name="expense_type"
               placeholder="Select expense type"
            >
               {expenseTypesList.map(expense => (
                  <SelectItem key={expense.value} value={expense.value}>
                     {expense.label}
                  </SelectItem>
               ))}
            </Select>
            <Select
               label="Payment type"
               name="payment_type"
               placeholder="Select payment type"
            >
               <SelectItem key="single" value={'single'}>
                  Single
               </SelectItem>
               <SelectItem key="monthly" value={'monthly'}>
                  Monthly
               </SelectItem>
            </Select>
            <FormButton type="submit" color="primary">
               Create Expense
            </FormButton>
         </form>
      </div>
   );
};
