'use server';
import { sql } from '@vercel/postgres';
import { z } from 'zod';
import type { BudgetLimit } from '@lib/constants/types/budget/budget';

const UpdateBudgetSchema = z.object({
  id: z.string(),
  budget_limit: z.number().optional(),
});

export async function updateBudgetLimit(formData: Partial<BudgetLimit>) {
  const validatedFields = UpdateBudgetSchema.safeParse({
    id: formData.id,
    budget_limit: formData.budget_limit,
  });

  try {
    if (!validatedFields.success) {
      throw new Error('Fill all necessary fields.');
    }

    const { id, budget_limit } = validatedFields.data;

    const timeOfUpdate = new Date().toISOString();

    const updateBudgetLimit = await sql`
   UPDATE budget
   SET
    budget_limit = COALESCE(${budget_limit}, budget_limit),
    updated_at = ${timeOfUpdate}
   WHERE id = ${id}
   `;
  } catch (error) {
    const errorMessage = error instanceof Error && error.message;
    console.log(error);
    return { error: error, message: errorMessage };
  }
}
