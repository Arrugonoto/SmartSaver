'use server';
import { sql } from '@vercel/postgres';
import { z } from 'zod';
import type { BudgetLimit } from '@lib/constants/types/budget/budget';

const BudgetSchema = z.object({
  user_id: z.string(),
  budget_limit: z.number(),
});

export async function createBudgetLimit(formData: {
  user_id: string;
  budget_limit: number;
}) {
  const validatedFields = BudgetSchema.safeParse({
    user_id: formData.user_id,
    budget_limit: formData.budget_limit,
  });

  try {
    if (!validatedFields.success) {
      throw new Error('Fill all necessary fields.');
    }

    const { user_id, budget_limit } = validatedFields.data;

    const timeOfCreation = new Date().toISOString();

    const createNewBudgetLimit = await sql<BudgetLimit>`
      INSERT INTO budget (user_id, budget_limit, created_at)
      VALUES (${user_id}, ${budget_limit}, ${timeOfCreation})
      `;
  } catch (error) {
    const errorMessage = error instanceof Error && error.message;
    console.log(error);
    return { error: error, message: errorMessage };
  }
}
