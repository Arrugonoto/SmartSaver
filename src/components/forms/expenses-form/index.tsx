'use client';
import type { Expense } from '@/lib/definitions';
import { useState } from 'react';
import { Select, SelectSection, SelectItem } from '@nextui-org/select';
import { Input } from '@nextui-org/input';

export const ExpensesForm = () => {
   const [expenseType, setExpenseType] = useState<'single' | 'subscription'>(
      'single'
   );
   const [formData, setFormData] = useState<Expense>({
      id: '',
      user_id: '',
      name: '',
      amount: 0,
      type: expenseType,
   });

   return (
      <div className="flex bg-gray-900 p-2 rounded-md">
         <form className="flex flex-col gap-3 min-w-[200px] w-[320px]">
            <Input type="text" label="Expense name" />
            <Input type="number" label="Expense amount" />
            <Select label="Expense type">
               <SelectItem key="basic-expenses">Basic expenses</SelectItem>
               <SelectItem key="healthcare">Healthcare</SelectItem>
               <SelectItem key="entertainment">Entertainment</SelectItem>
               <SelectItem key="bills">Bills</SelectItem>
            </Select>
            <Select label="Payment type">
               <SelectItem key="single">Single</SelectItem>
               <SelectItem key="monthly">Monthly</SelectItem>
            </Select>
         </form>
      </div>
   );
};
