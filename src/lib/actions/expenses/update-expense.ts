'use server';
import { sql } from '@vercel/postgres';
import { z } from 'zod';

const UpdateExpenseSchema = z.object({
   id: z.string(),
   name: z.string().optional(),
   amount: z.number().optional(),
   expense_type: z.string().optional(),
   payment_type: z.string().optional(),
   description: z.string().optional(),
});

export async function createExpense(formData: {
   id: string;
   name: string;
   amount: number;
   expense_type: string;
   payment_type: string;
   description?: string;
}) {
   const validatedFields = UpdateExpenseSchema.safeParse({
      id: formData.id,
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

      const { name, amount, expense_type, payment_type, description, id } =
         validatedFields.data;

      const timeOfUpdate = new Date().toISOString();

      const updateExpense = await sql`
      UPDATE expenses
      SET
       name = COALESCE(${name}, name)
       amount = COALESCE(${amount}, amount)
       expense_type = COALESCE(${expense_type}, expense_type)
       payment_type = COALESCE(${payment_type}, payment_type)
       description = COALESCE(${description}, description)
       updated_at = ${timeOfUpdate}
      WHERE id = ${id};
      `;
   } catch (error) {
      const errorMessage = error instanceof Error && error.message;
      console.log(error);
      return { error: error, message: errorMessage };
   }
}
