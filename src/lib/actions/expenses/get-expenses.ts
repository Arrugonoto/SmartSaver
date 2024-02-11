'use server';
import { sql } from '@vercel/postgres';
import type { Expense } from '@lib/definitions';

export async function getExpenses(user_id: string) {
   try {
      const userExpenses = await sql<Expense>`
      SELECT * FROM expenses WHERE user_id=${user_id} `;

      if (userExpenses.rows.length === 0) {
         throw new Error(`You have no expenses to keep track of`);
      }
   } catch (error) {
      const errorMessage = error instanceof Error && error.message;
      console.log(error);
      return { error: error, message: errorMessage };
   }
}
