export type Expense = {
   user_id: string;
   name: string;
   amount: number;
   expense_type: string;
   payment_type: 'single' | 'monthly' | 'subscription';
   created_At: Date;
   updated_At: Date;
};

export type ExpenseTypes = {
   label: string;
   value: string;
};
