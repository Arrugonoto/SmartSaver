'use client';
import React, { useState, useEffect } from 'react';
import { Input } from '@nextui-org/input';
import { createBudgetLimit } from '@lib/actions/budget/create-budget-limit';
import { updateBudgetLimit } from '@lib/actions/budget/update-budget-limit';
import { getBudgetLimit } from '@lib/actions/budget/get-budget-limit';
import { useSession } from 'next-auth/react';
import FormButton from '@components/buttons/FormButton';
import { useFetch } from '@lib/hooks/useFetch';
import type { BudgetLimit } from '@lib/constants/types/budget/budget';
import { pushNotification } from '@lib/helpers/push-notification';
import { useTheme } from 'next-themes';
import { useExpensesStore } from '@store/expensesStore';

export const BudgetForm = ({ update }: { update?: boolean }) => {
  const { data: session } = useSession();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const user = session?.user;
  const user_id = user?.id;
  const { budgetLimit, setBudgetLimit } = useExpensesStore((state) => ({
    budgetLimit: state.budgetLimit,
    setBudgetLimit: state.setBudgetLimit,
  }));
  const [newLimit, setNewLimit] = useState<number | null>(null);

  const { fetchData, data } = useFetch<BudgetLimit>({
    action: getBudgetLimit,
    user_id,
  });

  const handleManualFetch = () => {
    if (session?.user.id) {
      fetchData(session?.user.id);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedLimit = parseFloat(e.target.value);
    setNewLimit(parsedLimit);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!update && user && newLimit) {
      await createBudgetLimit({ user_id, budget_limit: newLimit });
    }

    if (update && user && newLimit) {
      updateBudgetLimit({ id: data?.id, budget_limit: newLimit });
    }

    resetForm();

    handleManualFetch();
    setIsLoading(false);
    pushNotification({
      status: 'success',
      text: update ? 'Budget limit updated' : 'Budget limit added',
      config: {
        theme: theme,
      },
    });
  };

  const resetForm = () => {
    setNewLimit(null);
  };

  useEffect(() => {
    if (data) {
      setBudgetLimit(data.budget_limit);
    }
  }, [data, setBudgetLimit]);

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <Input
          type="number"
          name="budgetLimit"
          label="Budget limit"
          placeholder={`${budgetLimit ?? ''}`}
          value={newLimit?.toString() || ''}
          isInvalid={update && newLimit !== null && newLimit === budgetLimit}
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
            isDisabled={newLimit === budgetLimit || (newLimit as number) < 1}
            loading={isLoading}
          >
            {isLoading ? '' : 'Update limit'}
          </FormButton>
        ) : (
          <FormButton
            type="submit"
            color="primary"
            loading={isLoading}
            isDisabled={(newLimit as number) < 1}
          >
            {isLoading ? '' : 'Save limit'}
          </FormButton>
        )}
      </form>
    </div>
  );
};
