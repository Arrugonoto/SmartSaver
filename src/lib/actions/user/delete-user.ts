' use server';
import { sql } from '@vercel/postgres';

export async function deleteUser(user_id: string) {
   try {
      // Delete user related data before deleting account
      // Before deleting user delete all created expenses and expense_summary
      // after that, delete user
      const deleteExpenses =
         await sql`DELETE FROM expenses WHERE user_id=${user_id}`;

      const deleteSummary =
         await sql`DELETE FROM expenses_summary WHERE user_id=${user_id}`;

      const deleteUser = await sql`DELETE FROM users WHERE id=${user_id}`;
   } catch (error) {
      const errorMessage = error instanceof Error && error.message;
      console.log(error);
      return { error: error, message: errorMessage };
   }
}
