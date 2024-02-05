'use server';
import { sql } from '@vercel/postgres';
import type { Expense } from '@/lib/definitions';

export async function getExpensesSummary(user_id: string) {
   try {
      const userExpenses = await sql<Expense>`
      SELECT amount FROM expenses WHERE user_id=${user_id} `;

      if (userExpenses.rows.length === 0) {
         throw new Error(`You have no expenses to keep track of`);
      }
      const expensesList = userExpenses.rows.map(expense => expense);
      const amounts: number[] = userExpenses.rows.map(
         expense => expense.amount
      );
      const expensesSummary = amounts.reduce((curr, next) => curr + next, 0);

      return { expensesSummary, expensesList };
   } catch (error) {
      const errorMessage = error instanceof Error && error.message;
      console.log(error);
      return { error: error, message: errorMessage };
   }
}
