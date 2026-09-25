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
  href?: string | null;
};

export const NOTIFICATION_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'account', label: 'Account' },
  { id: 'investment', label: 'Investment' },
  { id: 'pools', label: 'Pools' },
] as const;

export type NotificationFilterId = (typeof NOTIFICATION_FILTERS)[number]['id'];

export const NOTIFICATION_SECTIONS = [
  { id: 'today', label: 'TODAY' },
  { id: 'yesterday', label: 'YESTERDAY' },
  { id: 'earlier', label: 'EARLIER' },
] as const;
