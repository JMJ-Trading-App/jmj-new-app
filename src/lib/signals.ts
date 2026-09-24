import { apiRequest } from '@/lib/api/client';
import type { SignalsFeedResponse, TradeSignalApi } from '@/lib/api/types';

export async function fetchSignals() {
  return apiRequest<SignalsFeedResponse>('/signals', { auth: true });
}

export async function fetchSignal(id: string) {
  return apiRequest<{
    access: 'active' | 'ended';
    signal: TradeSignalApi;
  }>(`/signals/${id}`, { auth: true });
}
