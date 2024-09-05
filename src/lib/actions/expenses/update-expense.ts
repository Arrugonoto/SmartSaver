'use server';
import { sql } from '@vercel/postgres';
import { z } from 'zod';
import type { ExpenseIdRequired } from '@lib/constants/types/expenses/expenses';

const UpdateExpenseSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  amount: z.number().optional(),
  expense_type: z.string().optional(),
  payment_type: z.string().optional(),
  payment_duration: z.number().optional(),
  description: z.string().optional(),
});

export async function updateExpense(formData: Partial<ExpenseIdRequired>) {
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

    console.log(validatedFields.data);

    const {
      name,
      amount,
      expense_type,
      payment_type,
      description,
      id,
      payment_duration,
    } = validatedFields.data;

    const timeOfUpdate = new Date().toISOString();

    if (payment_type === 'one-time') {
      const updateExpense = await sql<ExpenseIdRequired>`
         UPDATE expenses
         SET
          name = COALESCE(${name}, name),
          amount = COALESCE(${amount}, amount),
          expense_type = COALESCE(${expense_type}, expense_type),
          payment_type = COALESCE(${payment_type}, payment_type),
          description = COALESCE(${description}, description),
          updated_at = ${timeOfUpdate}
         WHERE id = ${id};
         `;
    }

    if (payment_type === 'monthly') {
      const updateExpense = await sql<ExpenseIdRequired>`
         UPDATE expenses
         SET
          name = COALESCE(${name}, name),
          amount = COALESCE(${amount}, amount),
          expense_type = COALESCE(${expense_type}, expense_type),
          payment_type = COALESCE(${payment_type}, payment_type),
          description = COALESCE(${description}, description),
          payment_duration = COALESCE(${payment_duration}, payment_duration),
          updated_at = ${timeOfUpdate}
         WHERE id = ${id};
         `;
    }

    if (payment_type === 'subscription') {
      const updateExpense = await sql<ExpenseIdRequired>`
         UPDATE subscriptions
         SET
          name = COALESCE(${name}, name),
          amount = COALESCE(${amount}, amount),
          expense_type = COALESCE(${expense_type}, expense_type),
          description = COALESCE(${description}, description),
          payment_duration = COALESCE(${payment_duration}, payment_duration),
          updated_at = ${timeOfUpdate}
         WHERE id = ${id};
         `;
    }
  } catch (error) {
    const errorMessage = error instanceof Error && error.message;
    console.log(error);
    return { error: error, message: errorMessage };
  }
}
