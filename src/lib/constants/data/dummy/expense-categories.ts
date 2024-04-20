import type { ExpenseCategories } from '@constants/types/expenses/expenses';

export const expenseCategoriesList: ExpenseCategories[] = [
  { label: 'Select type', value: '' },
  {
    label: 'Basic',
    value: 'basic-expenses',
  },
  {
    label: 'Beauty',
    value: 'beauty',
  },
  {
    label: 'Bills',
    value: 'bills',
  },
  {
    label: 'Car & Transport',
    value: 'car-and-transport',
  },
  {
    label: 'Clothing & Footwear',
    value: 'clothing-and-footwear',
  },
  {
    label: 'Education',
    value: 'education',
  },
  {
    label: 'Entertainment',
    value: 'entertainment',
  },
  {
    label: 'Healthcare',
    value: 'healthcare',
  },
  {
    label: 'Self Improvement',
    value: 'self-improvement',
  },
  {
    label: 'Travel',
    value: 'travel',
  },
  {
    label: 'Other',
    value: 'other',
  },
];
