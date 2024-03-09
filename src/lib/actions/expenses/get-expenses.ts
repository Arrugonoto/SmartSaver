'use server';
import { sql } from '@vercel/postgres';
import type { Expense } from '@lib/definitions';

export async function getExpenses(user_id: string, page: number) {
   // change this value to limit returned results from query
   // as default 20
   // to make it dynamic just pass prop i.e. 'resultsPerPage'
   const resultsLimit = 20;

   try {
      const userExpenses = await sql<Expense>`
      SELECT id, name, amount, expense_type, payment_type, description, created_at, updated_at 
      FROM expenses 
      WHERE user_id=${user_id}
      LIMIT ${resultsLimit}
      OFFSET ${(page - 1) * resultsLimit}
      `;

      const pagesInDB = await sql`
      SELECT COUNT(*) AS total_pages
      FROM expenses
      WHERE user_id = ${user_id}
      `;

      const totalPages = Math.ceil(
         pagesInDB.rows[0].total_pages / resultsLimit
      );

      if (userExpenses.rows.length === 0) {
         return { message: `You have no expenses to keep track of` };
      }

      return {
         data: userExpenses.rows,
         totalPages: totalPages,
         status: 'success',
      };
   } catch (error) {
      const errorMessage = error instanceof Error && error.message;
      console.log(error);
      return { error: error, message: errorMessage, status: 'fail' };
   }
}
