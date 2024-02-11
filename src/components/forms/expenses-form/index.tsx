'use client';
import type { Expense } from '@lib/definitions';
import { useState } from 'react';
import { Select, SelectItem } from '@nextui-org/select';
import { Input } from '@nextui-org/input';
import { expenseTypesList } from '@data/dummy/expenses-types';

export const ExpensesForm = () => {
   const [paymentType, setPaymentType] = useState<'single' | 'subscription'>(
      'single'
   );
   const [formData, setFormData] = useState<Expense>({
      id: '',
      user_id: '',
      name: '',
      amount: 0,
      type: paymentType,
   });

   return (
      <div className="flex bg-gray-900 p-2 rounded-md">
         <form className="flex flex-col gap-3 min-w-[200px] w-[320px]">
            <Input type="text" label="Expense name" />
            <Input type="number" label="Expense amount" />
            <Select label="Expense type">
               {expenseTypesList.map(expense => (
                  <SelectItem key={expense.value} value={expense.value}>
                     {expense.label}
                  </SelectItem>
               ))}
            </Select>
            <Select label="Payment type">
               <SelectItem key="single">Single</SelectItem>
               <SelectItem key="monthly">Monthly</SelectItem>
            </Select>
         </form>
      </div>
   );
};
