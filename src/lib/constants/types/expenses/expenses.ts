type PaymentType = 'one-time' | 'monthly' | 'subscription' | '';

export type Expense = {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  expense_type: string;
  payment_type: PaymentType;
  description?: string;
  created_at: Date;
  updated_at?: Date;
};

export type ExpenseIdRequired = Expense & { id: string };

export type ExpenseCategories = {
  label: string;
  value: string;
  color: string;
};
