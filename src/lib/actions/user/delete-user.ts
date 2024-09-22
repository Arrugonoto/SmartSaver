'use server';
import { sql } from '@vercel/postgres';

export async function deleteUser(formData: { email: string; user_id: string }) {
  const { user_id, email } = formData;

  // Delete user related data before deleting account.
  // Before deleting user delete all created expenses, summary, and budget data,
  // after that, delete user
  const deleteExpenses =
    await sql`DELETE FROM expenses WHERE user_id=${user_id}`;

  const deleteSubscriptions =
    await sql`DELETE FROM subscriptions WHERE user_id=${user_id}`;

  const deleteSummary =
    await sql`DELETE FROM expenses_summary WHERE user_id=${user_id}`;

  const deleteBudget = await sql`DELETE FROM budget WHERE user_id=${user_id}`;

  // PostgreSQL performs DELETE statement on all rows which mmatch condition;
  // if no rows matches condition, Postgre just reurns info about '0 rows deleted';
  // so no additional check is required

  const deleteUser = await sql`DELETE FROM users WHERE email=${email}`;
  return { message: `Account deleted succesfully` };
}
