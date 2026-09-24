import { apiRequest } from '@/lib/api/client';

export type ActivityItem = {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
  type: 'credit' | 'debit';
  category: 'deposit' | 'withdrawal' | 'investment' | 'pool' | 'signal' | 'metatrader';
  occurredAt?: string;
  href?: string | null;
};

export async function fetchRecentActivity(
  take = 20,
  category?: 'metatrader' | 'all',
) {
  const params = new URLSearchParams();
  params.set('take', String(take));
  if (category && category !== 'all') {
    params.set('category', category);
  }
  return apiRequest<{ activities: ActivityItem[]; count: number }>(
    `/activity/recent?${params.toString()}`,
    { auth: true },
  );
}
