export type Expense = {
   id?: string;
   user_id: string;
   name: string;
   amount: number;
   expense_type: string;
   payment_type: 'single' | 'monthly' | 'subscription' | '';
   description?: string;
   created_at?: Date;
   updated_at?: Date;
};

export type ExpenseTypes = {
   label: string;
   value: string;
};
