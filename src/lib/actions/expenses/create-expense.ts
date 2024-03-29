'use server';
import { sql } from '@vercel/postgres';
import { z } from 'zod';
import type { Expense } from '@lib/definitions';

const ExpenseSchema = z.object({
   user_id: z.string(),
   name: z.string(),
   amount: z.number(),
   expense_type: z.string(),
   payment_type: z.string(),
   description: z.string().optional(),
});

export async function createExpense(formData: {
   user_id: string;
   name: string;
   amount: number;
   expense_type: string;
   payment_type: string;
   description?: string;
}) {
   const validatedFields = ExpenseSchema.safeParse({
      user_id: formData.user_id,
      name: formData.name,
      amount: formData.amount,
      expense_type: formData.expense_type,
      payment_type: formData.payment_type,
      description: formData.description || '',
   });

   try {
      if (!validatedFields.success) {
         throw new Error('Fill all necessary fields.');
      }

      const { user_id, name, amount, expense_type, payment_type, description } =
         validatedFields.data;

      const timeOfCreation = new Date().toISOString();

      const createNewExpense = await sql<Expense>`
      INSERT INTO expenses (user_id, name, amount, expense_type, payment_type, description, created_at)
      VALUES (${user_id}, ${name}, ${amount}, ${expense_type}, ${payment_type}, ${description} , ${timeOfCreation})
      `;
   } catch (error) {
      const errorMessage = error instanceof Error && error.message;
      console.log(error);
      return { error: error, message: errorMessage };
   }
}
