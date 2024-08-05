// Type definitions for Tables inside of Database

type PaymentType = 'one-time' | 'monthly' | 'subscription' | '';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  profile_image_url: string;
  created_at: Date;
};

export type UsersExpenses = {
  id: string;
  user_id: string;
  total_amount: number;
};

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
  payment_duration?: number;
};

export interface Subscription extends Expense {
  payment_duration: number;
}
