export type Expense = {
   id: string;
   user_id: string;
   name: string;
   amount: number;
   expense_type: string;
   payment_type: 'one-time' | 'monthly' | 'subscription' | '';
   description?: string;
   created_at: Date;
   updated_at?: Date;
};

export type ExpenseIdRequired = Expense & { id: string };

export type ExpenseTypes = {
   label: string;
   value: string;
};
