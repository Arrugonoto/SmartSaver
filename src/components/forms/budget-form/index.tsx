'use client';
import React, { useState } from 'react';
import { Input } from '@nextui-org/input';
import { createBudgetLimit } from '@lib/actions/budget/create-budget-limit';
import { updateBudgetLimit } from '@lib/actions/budget/update-budget-limit';
import { getBudgetLimit } from '@lib/actions/budget/get-budget-limit';
import { useSession } from 'next-auth/react';
import FormButton from '@components/buttons/FormButton';
import { useFetch } from '@lib/hooks/useFetch';
import type { BudgetLimit } from '@lib/constants/types/budget/budget';

export const BudgetForm = ({ update }: { update?: boolean }) => {
  const { data: session } = useSession();
  const user = session?.user;
  const user_id = user?.id;
  const [budgetLimit, setBudgetLimit] = useState<number | null>(null);

  const { data } = useFetch<BudgetLimit>({
    action: getBudgetLimit,
    user_id,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedLimit = parseFloat(e.target.value);
    setBudgetLimit(parsedLimit);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!update && user && budgetLimit) {
      await createBudgetLimit({ user_id, budget_limit: budgetLimit });
    }

    if (update && user && budgetLimit) {
      updateBudgetLimit({ id: data?.id, budget_limit: budgetLimit });
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
          placeholder={`${data?.budget_limit ?? ''}`}
          value={budgetLimit?.toString() || ''}
          isInvalid={
            update && budgetLimit !== null && data?.budget_limit == budgetLimit
          }
          step="0.01"
          min={1}
          isRequired
          errorMessage="New limit can't be same as current limit"
          onChange={(e) => handleChange(e)}
        />

        {update ? (
          <FormButton
            type="submit"
            color="primary"
            isDisabled={
              budgetLimit !== null &&
              (data?.budget_limit as number) == budgetLimit
            }
          >
            Update limit
          </FormButton>
        ) : (
          <FormButton type="submit" color="primary">
            Save limit
          </FormButton>
        )}
      </form>
    </div>
  );
};
