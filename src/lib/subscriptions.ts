import { apiRequest } from '@/lib/api/client';
import type {
  CheckoutResponse,
  SubscriptionPlansResponse,
  SubscriptionApi,
} from '@/lib/api/types';
import { updateSessionUser } from '@/lib/session';

export async function fetchSubscriptionPlans() {
  return apiRequest<SubscriptionPlansResponse>('/subscriptions/plans');
}

export async function fetchMySubscriptions() {
  return apiRequest<{
    subscriptions: SubscriptionApi[];
    activeSignals: SubscriptionApi | null;
    activeClasses: SubscriptionApi | null;
  }>('/subscriptions/mine', { auth: true });
}

export async function checkoutSubscription(planId: string) {
  const result = await apiRequest<CheckoutResponse>('/subscriptions/checkout', {
    method: 'POST',
    auth: true,
    body: { planId },
  });
  if (result.user) {
    await updateSessionUser(result.user);
  }
  return result;
}

export async function verifySubscriptionPayment(reference: string) {
  const result = await apiRequest<CheckoutResponse>('/subscriptions/verify', {
    method: 'POST',
    auth: true,
    body: { reference },
  });
  if (result.user) {
    await updateSessionUser(result.user);
  }
  return result;
}
