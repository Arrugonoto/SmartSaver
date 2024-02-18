// Type definitions for data inside of Database

export type User = {
   id: string;
   name: string;
   email: string;
   password: string;
   profile_image_url: string;
};

export type UsersExpenses = {
   id: string;
   user_id: string;
   amount: number;
};

export type Expense = {
   id: string;
   user_id: string;
   name: string;
   amount: number;
   expense_type: string;
   payment_type: 'single' | 'monthly' | 'subscription';
};
