import { apiRequest } from '@/lib/api/client';
import type { AccountCard } from '@/constants/home-data';

export type ActivityItem = {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
  type: 'credit' | 'debit';
  category: 'deposit' | 'withdrawal' | 'investment' | 'pool' | 'signal' | 'metatrader';
  kind?: string;
  occurredAt?: string;
  href?: string | null;
};

export type AccountBalanceCard = AccountCard & {
  balanceValue?: number;
  monthlyPercent?: number;
  currency?: string;
  linked?: boolean;
};

export async function fetchRecentActivity(take = 20) {
  const params = new URLSearchParams();
  params.set('take', String(take));
  return apiRequest<{ activities: ActivityItem[]; count: number }>(
    `/activity/recent?${params.toString()}`,
    { auth: true },
  );
}

export async function fetchAccountBalances() {
  return apiRequest<{ accounts: AccountBalanceCard[] }>('/activity/balances', {
    auth: true,
  });
}

/** Best-effort MetaTrader sync (balance + deals). Ignores failures when not linked. */
export async function syncMetaTraderAccount() {
  return apiRequest<{
    message: string;
    upserted?: number;
    balance?: number | null;
    equity?: number | null;
  }>('/metatrader/me/sync', {
    method: 'POST',
    auth: true,
  });
}
