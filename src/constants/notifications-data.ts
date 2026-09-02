export type NotificationCategory = 'account' | 'investment' | 'pools';

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  category: NotificationCategory;
  unread: boolean;
  icon:
    | 'kyc'
    | 'funded'
    | 'payout'
    | 'pool-complete'
    | 'investment-confirmed'
    | 'new-pool'
    | 'withdrawal';
  section: 'today' | 'yesterday' | 'earlier';
};

export const NOTIFICATION_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'account', label: 'Account' },
  { id: 'investment', label: 'Investment' },
  { id: 'pools', label: 'Pools' },
] as const;

export type NotificationFilterId = (typeof NOTIFICATION_FILTERS)[number]['id'];

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'KYC Verification Approved',
    body: 'Your identity verification is complete. You can now access funding and withdrawals.',
    time: '2 hours ago',
    category: 'account',
    unread: true,
    icon: 'kyc',
    section: 'today',
  },
  {
    id: '2',
    title: 'Investment Funded',
    body: 'Your investment of $500.00 has been successfully funded.',
    time: '5 hours ago',
    category: 'investment',
    unread: false,
    icon: 'funded',
    section: 'today',
  },
  {
    id: '3',
    title: 'Payout Sent',
    body: 'A payout of $120.00 has been sent to your linked bank account.',
    time: 'Just now',
    category: 'investment',
    unread: false,
    icon: 'payout',
    section: 'today',
  },
  {
    id: '4',
    title: 'Pool Fund Complete',
    body: 'The Alpha Growth pool has reached its funding target.',
    time: '2 hours ago',
    category: 'pools',
    unread: false,
    icon: 'pool-complete',
    section: 'today',
  },
  {
    id: '5',
    title: 'Investment Confirmed',
    body: 'Your trade allocation in Momentum Fund is confirmed.',
    time: 'Yesterday, 4:30 PM',
    category: 'investment',
    unread: false,
    icon: 'investment-confirmed',
    section: 'yesterday',
  },
  {
    id: '6',
    title: 'New Pool Available',
    body: 'A new community pool is open for contributions.',
    time: 'Yesterday, 10:00 AM',
    category: 'pools',
    unread: false,
    icon: 'new-pool',
    section: 'yesterday',
  },
  {
    id: '7',
    title: 'Withdrawal Processed',
    body: 'Your withdrawal of $150.00 has been processed successfully.',
    time: 'Oct 12, 11:45 AM',
    category: 'account',
    unread: false,
    icon: 'withdrawal',
    section: 'earlier',
  },
];

export const NOTIFICATION_SECTIONS = [
  { id: 'today', label: 'TODAY' },
  { id: 'yesterday', label: 'YESTERDAY' },
  { id: 'earlier', label: 'EARLIER' },
] as const;
