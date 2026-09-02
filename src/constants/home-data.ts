export type AccountCard = {
  id: string;
  label: string;
  balance: string;
  monthlyChange: string;
  monthlyPositive?: boolean;
};

export type ActivityItem = {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
  type: 'credit' | 'debit';
  category: 'deposit' | 'withdrawal' | 'investment' | 'pool' | 'signal';
};

export const HOME_ACCOUNTS: AccountCard[] = [
  {
    id: 'individual',
    label: 'Individual Account',
    balance: '$0.00',
    monthlyChange: '$0.00 this month',
    monthlyPositive: true,
  },
  {
    id: 'pool',
    label: 'Pool Account',
    balance: '$1,250.00',
    monthlyChange: '+$120.00 this month',
    monthlyPositive: true,
  },
];

export const RECENT_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    title: 'Deposit via Bank Transfer',
    subtitle: 'Today · 09:24 AM',
    amount: '+$500.00',
    type: 'credit',
    category: 'deposit',
  },
  {
    id: '2',
    title: 'Pool Contribution',
    subtitle: 'Yesterday · 04:12 PM',
    amount: '-$200.00',
    type: 'debit',
    category: 'pool',
  },
  {
    id: '3',
    title: 'Signal Subscription',
    subtitle: 'Mar 12 · 11:05 AM',
    amount: '-$29.99',
    type: 'debit',
    category: 'signal',
  },
  {
    id: '4',
    title: 'Investment Return',
    subtitle: 'Mar 10 · 02:40 PM',
    amount: '+$86.40',
    type: 'credit',
    category: 'investment',
  },
  {
    id: '5',
    title: 'Withdrawal to Bank',
    subtitle: 'Mar 8 · 08:15 AM',
    amount: '-$150.00',
    type: 'debit',
    category: 'withdrawal',
  },
];
