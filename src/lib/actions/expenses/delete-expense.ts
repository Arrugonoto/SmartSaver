'use server';
import { sql } from '@vercel/postgres';

export async function deleteExpense(expense_id: string) {
   try {
      await sql`DELETE FROM expenses WHERE id = ${expense_id}`;
   } catch (error) {
      const errorMessage = error instanceof Error && error.message;
      console.log(error);
      return { error: error, message: errorMessage };
   }
}
