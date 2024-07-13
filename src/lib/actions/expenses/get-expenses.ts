'use server';
import { sql } from '@vercel/postgres';
import type { Expense } from '@lib/definitions';
import { unstable_noStore as noStore } from 'next/cache';

export async function getExpenses(user_id: string) {
  noStore();

  try {
    const userExpenses = await sql<Expense>`
      SELECT id, name, amount, expense_type, payment_type, description, created_at, updated_at 
      FROM expenses 
      WHERE user_id=${user_id}
      `;

    const totalResults = await sql`
      SELECT COUNT(*) AS total_results
      FROM expenses
      WHERE user_id = ${user_id}
      `;

    if (userExpenses.rows.length === 0) {
      return { message: `You have no expenses to keep track of` };
    }

    return {
      data: userExpenses.rows,
      totalResults: totalResults.rows[0].total_results,
      status: 'success',
    };
  } catch (error) {
    const errorMessage = error instanceof Error && error.message;
    console.log(error);
    return { error: error, message: errorMessage, status: 'fail' };
  }
}
