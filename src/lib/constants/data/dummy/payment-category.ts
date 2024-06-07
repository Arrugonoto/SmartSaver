type PaymentCategory = {
  label: string;
  value: string;
};

export const paymentCategory: PaymentCategory[] = [
  {
    label: 'One time',
    value: 'one-time',
  },
  {
    label: 'Monthly',
    value: 'mnonthly',
  },
  {
    label: 'Subscription',
    value: 'subscription',
  },
];
