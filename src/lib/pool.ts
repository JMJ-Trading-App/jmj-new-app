import { apiRequest } from '@/lib/api/client';
import type {
  JoinPoolResponse,
  PaymentMethodApi,
  PoolItemApi,
  PoolListResponse,
} from '@/lib/api/types';
import type { PaymentInstructions } from '@/constants/invest-flow-data';

export async function fetchPoolOptions() {
  return apiRequest<{
    serviceChargeRate: number;
    paymentInstructions: PaymentInstructions;
  }>('/pool/options');
}

export async function fetchPools() {
  return apiRequest<PoolListResponse>('/pool', { auth: true });
}

export async function fetchPool(id: string) {
  return apiRequest<PoolItemApi>(`/pool/${id}`, { auth: true });
}

export async function joinPool(
  id: string,
  payload: {
    paymentMethod: PaymentMethodApi;
    paymentProofUrl?: string;
    contributionUsd?: number;
  },
) {
  return apiRequest<JoinPoolResponse>(`/pool/${id}/join`, {
    method: 'POST',
    auth: true,
    body: payload,
  });
}
