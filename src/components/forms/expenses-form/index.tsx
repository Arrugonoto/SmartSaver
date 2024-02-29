'use client';
import React, { useState } from 'react';
import { Select, SelectItem } from '@nextui-org/select';
import { Input } from '@nextui-org/input';
import { expenseTypesList } from '@data/dummy/expenses-types';
import { Expense } from '@constants/types/expenses/expenses';
import FormButton from '@components/buttons/FormButton';
import { createExpense } from '@lib/actions/expenses/create-expense';

export const ExpensesForm = ({ user_id }: { user_id: string }) => {
   const [formData, setFormData] = useState<Expense>({
      user_id: user_id,
      name: '',
      amount: 0,
      expense_type: '',
      payment_type: 'single',
   });

   const resetForm = () => {
      setFormData({
         user_id: user_id,
         name: '',
         amount: 0,
         expense_type: '',
         payment_type: 'single',
      });
   };

   const handleChange = (
      e:
         | React.ChangeEvent<HTMLSelectElement>
         | React.ChangeEvent<HTMLInputElement>
   ) => {
      setFormData(prev => ({
         ...prev,
         [e.target.name]: e.target.value,
      }));
   };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      console.log(formData);

      // await createExpense(newExpense);
      // resetForm();
   };

   return (
      <div className="flex p-2 rounded-md">
         <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
            <Input
               type="text"
               name="name"
               label="Expense name"
               value={formData.name}
               isRequired
               onChange={e => handleChange(e)}
            />
            <Input
               type="number"
               name="amount"
               label="Expense amount"
               value={formData.amount.toString()}
               min={1}
               isRequired
               onChange={e => handleChange(e)}
            />
            <Select
               label="Expense type"
               name="expense_type"
               placeholder="Select expense type"
               selectedKeys={[`${formData.expense_type}`]}
               disabledKeys={['']}
               isRequired
               onChange={e => handleChange(e)}
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
               selectedKeys={[`${formData.payment_type}`]}
               disabledKeys={['none']}
               isRequired
               onChange={e => handleChange(e)}
            >
               <SelectItem key="none" value={''}>
                  Select value
               </SelectItem>
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
