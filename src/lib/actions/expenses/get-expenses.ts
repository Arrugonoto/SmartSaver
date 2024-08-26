'use server';
import { sql } from '@vercel/postgres';
import type { Expense, Subscription } from '@lib/definitions';
import { unstable_noStore as noStore } from 'next/cache';

export async function getExpenses(user_id: string) {
  noStore();

  try {
    const userExpenses = await sql<Expense>`
      SELECT id, name, amount, expense_type, payment_type, description, created_at, updated_at, payment_duration 
      FROM expenses 
      WHERE user_id=${user_id}
      `;

    const userSubscriptions = await sql<Subscription>`
    SELECT id, name, amount, expense_type, payment_type, description, created_at, updated_at, payment_duration
    FROM subscriptions
    WHERE user_id=${user_id}
    `;

    const numOfExpenses = await sql`
      SELECT COUNT(*) AS total_results
      FROM expenses
      WHERE user_id = ${user_id}
      `;

    const numOfSubscriptions = await sql`
    SELECT COUNT(*) AS total_results
    FROM subscriptions
    WHERE user_id = ${user_id}
    `;

    if (userExpenses.rows.length === 0) {
      return { message: `You have no expenses to keep track of.` };
    }

    if (userSubscriptions.rows.length === 0) {
      return { message: `You have no subscriptions to keep track of.` };
    }

    const totalResults =
      parseInt(numOfExpenses.rows[0].total_results) +
      parseInt(numOfSubscriptions.rows[0].total_results);

    return {
      data: {
        expenses: userExpenses.rows,
        subscriptions: userSubscriptions.rows,
      },
      totalResults: totalResults,
      status: 'success',
    };
  } catch (error) {
    const errorMessage = error instanceof Error && error.message;
    console.log(error);
    return { error: error, message: errorMessage, status: 'fail' };
  }
}
