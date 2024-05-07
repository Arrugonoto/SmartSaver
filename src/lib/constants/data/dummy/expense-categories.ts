import type { ExpenseCategories } from '@constants/types/expenses/expenses';

export const expenseCategoriesList: ExpenseCategories[] = [
  { label: 'Select type', value: '', color: '' },
  {
    label: 'Basic',
    value: 'basic-expenses',
    color: 'ff6200',
  },
  {
    label: 'Beauty',
    value: 'beauty',
    color: 'ab0066',
  },
  {
    label: 'Bills',
    value: 'bills',
    color: '525199',
  },
  {
    label: 'Car & Transport',
    value: 'car-and-transport',
    color: '9d64b5',
  },
  {
    label: 'Clothing & Footwear',
    value: 'clothing-and-footwear',
    color: '559bd1',
  },
  {
    label: 'Education',
    value: 'education',
    color: '008e91',
  },
  {
    label: 'Entertainment',
    value: 'entertainment',
    color: 'c66152',
  },
  {
    label: 'Healthcare',
    value: 'healthcare',
    color: '349651',
  },
  {
    label: 'Self Improvement',
    value: 'self-improvement',
    color: 'fffd18',
  },
  {
    label: 'Travel',
    value: 'travel',
    color: 'c68c52',
  },
  {
    label: 'Other',
    value: 'other',
    color: 'd3d3d3',
  },
];
