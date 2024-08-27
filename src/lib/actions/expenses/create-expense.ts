'use server';
import { sql } from '@vercel/postgres';
import { z } from 'zod';
import type { Expense, Subscription } from '@lib/definitions';

const ExpenseSchema = z.object({
  user_id: z.string(),
  name: z.string(),
  amount: z.number(),
  expense_type: z.string(),
  payment_type: z.string(),
  payment_duration: z.number().optional(),
  description: z.string().optional(),
});

export async function createExpense(formData: {
  user_id: string;
  name: string;
  amount: number;
  expense_type: string;
  payment_type: string;
  description?: string;
  payment_duration?: number;
}) {
  const validatedFields = ExpenseSchema.safeParse({
    user_id: formData.user_id,
    name: formData.name,
    amount: formData.amount,
    expense_type: formData.expense_type,
    payment_type: formData.payment_type,
    description: formData.description || '',
    payment_duration: formData.payment_duration,
  });

  try {
    if (!validatedFields.success) {
      throw new Error('Fill all necessary fields.');
    }

    const {
      user_id,
      name,
      amount,
      expense_type,
      payment_type,
      description,
      payment_duration,
    } = validatedFields.data;

    const timeOfCreation = new Date().toISOString();

    if (payment_type === 'one-time') {
      const createNewExpense = await sql<Expense>`
      INSERT INTO expenses (user_id, name, amount, expense_type, payment_type, description, created_at)
      VALUES (${user_id}, ${name}, ${amount}, ${expense_type}, ${payment_type}, ${description} , ${timeOfCreation})
      `;
    }
    if (payment_type === 'monthly') {
      const createNewExpense = await sql<Expense>`
      INSERT INTO expenses (user_id, name, amount, expense_type, payment_type, description, created_at, payment_duration)
      VALUES (${user_id}, ${name}, ${amount}, ${expense_type}, ${payment_type}, ${description} , ${timeOfCreation}, ${payment_duration})
      `;
    }
    if (payment_type === 'subscription') {
      const createNewExpense = await sql<Subscription>`
      INSERT INTO subscriptions (user_id, name, amount, expense_type, payment_type, description, created_at, payment_duration)
      VALUES (${user_id}, ${name}, ${amount}, ${expense_type}, ${payment_type}, ${description} , ${timeOfCreation}, ${payment_duration})
      `;
    }
  } catch (error) {
    const errorMessage = error instanceof Error && error.message;
    console.log(error);
    return { error: error, message: errorMessage };
  }
}
