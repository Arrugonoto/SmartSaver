type PaymentType = 'one-time' | 'monthly' | 'subscription' | '';

export interface Expenses {
  expenses: SingleExpense[];
  subscriptions: Subscription[];
}

// export interface Expense {
//   id: string;
//   user_id: string;
//   name: string;
//   amount: number;
//   expense_type: string;
//   payment_type: PaymentType;
//   description?: string;
//   created_at: Date;
//   updated_at?: Date;
// }

export interface ExpenseCategories {
  label: string;
  value: string;
  color: string;
}

export interface SingleExpense {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  expense_type: string;
  payment_type: PaymentType;
  description?: string;
  created_at: Date;
  updated_at?: Date;
  payment_duration?: number;
}

// export interface MonthlyPayment extends SingleExpense {
//   payment_duration: number;
// }

export interface Subscription extends SingleExpense {
  payment_duration: number;
}

export type ExpenseIdRequired = SingleExpense & { id: string };
