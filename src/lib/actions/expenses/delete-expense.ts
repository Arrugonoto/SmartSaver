'use server';
import { sql } from '@vercel/postgres';

export async function deleteExpense(expense_id: string, payment_type: string) {
  try {
    if (payment_type === 'one-time' || payment_type === 'monthly') {
      await sql`DELETE FROM expenses WHERE id = ${expense_id}`;
    }

    if (payment_type === 'subscription') {
      await sql`DELETE FROM subscriptions WHERE id = ${expense_id}`;
    }
  } catch (error) {
    const errorMessage = error instanceof Error && error.message;
    console.log(error);
    return { error: error, message: errorMessage };
  }
}
