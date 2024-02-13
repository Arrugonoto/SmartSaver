export type Expense = {
   user_id: string;
   name: string;
   amount: number;
   expense_type: string;
   payment_type: 'single' | 'monthly';
};

export type ExpenseTypes = {
   label: string;
   value: string;
};
