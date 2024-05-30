'use client';
import React, { useState } from 'react';
import { Input } from '@nextui-org/input';
import { createBudgetLimit } from '@lib/actions/budget/create-budget-limit';
import { useSession } from 'next-auth/react';
import FormButton from '@components/buttons/FormButton';

export const BudgetForm = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [budgetLimit, setBudgetLimit] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedLimit = parseFloat(e.target.value);
    setBudgetLimit(parsedLimit);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(budgetLimit);

    if (user && budgetLimit) {
      await createBudgetLimit({ user_id: user.id, budget_limit: budgetLimit });
    }

    resetForm();
  };

  const resetForm = () => {
    setBudgetLimit(null);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <Input
          type="number"
          name="budgetLimit"
          label="Budget limit"
          value={budgetLimit?.toString() || ''}
          step="0.01"
          min={1}
          isRequired
          onChange={(e) => handleChange(e)}
        />
        <FormButton type="submit" color="primary">
          Save limit
        </FormButton>
      </form>
    </div>
  );
};
