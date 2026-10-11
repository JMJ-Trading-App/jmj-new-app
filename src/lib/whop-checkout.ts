import * as WebBrowser from 'expo-web-browser';

import { apiRequest } from '@/lib/api/client';

const APP_RETURN_URL = 'jmjtradingapp://payment/return';

WebBrowser.maybeCompleteAuthSession();

export type WhopPaymentStatus = {
  id: string;
  kind: 'SUBSCRIPTION' | 'INVESTMENT' | 'POOL';
  status: 'PENDING' | 'PAID' | 'FAILED';
  targetId: string;
};

export function isHostedCheckout(mode: string | null | undefined) {
  return mode === 'bachs' || mode === 'whop';
}

export function openHostedCheckout(url: string) {
  return WebBrowser.openAuthSessionAsync(url, APP_RETURN_URL, {
    createTask: false,
    showInRecents: false,
  });
}

export async function waitForWhopPayment(paymentId: string) {
  const deadline = Date.now() + 45_000;
  let latest: WhopPaymentStatus = {
    id: paymentId,
    kind: 'SUBSCRIPTION',
    status: 'PENDING',
    targetId: '',
  };

  while (Date.now() < deadline) {
    latest = await apiRequest<WhopPaymentStatus>(`/payments/status/${paymentId}`, {
      auth: true,
    });
    if (latest.status !== 'PENDING') return latest;
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return latest;
}
