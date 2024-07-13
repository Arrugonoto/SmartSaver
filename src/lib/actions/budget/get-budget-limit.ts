'use server';
import { sql } from '@vercel/postgres';
import type { BudgetLimit } from '@lib/constants/types/budget/budget';
import { unstable_noStore as noStore } from 'next/cache';

export async function getBudgetLimit(user_id: string) {
  noStore();

  try {
    const userBudget = await sql<BudgetLimit>`
      SELECT id, budget_limit, created_at, updated_at 
      FROM budget 
      WHERE user_id=${user_id}
      `;

    return {
      data: userBudget.rows[0],
      status: 'success',
    };
  } catch (error) {
    const errorMessage = error instanceof Error && error.message;
    console.log(error);
    return { error: error, message: errorMessage, status: 'fail' };
  }
}
