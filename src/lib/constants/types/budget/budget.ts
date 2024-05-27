export type BudgetLimit = {
  id: string;
  user_id: string;
  budget_limit: number;
  created_at: Date;
  updated_at?: Date;
};

export type BudgetOmitId = Omit<BudgetLimit, 'id'>;
