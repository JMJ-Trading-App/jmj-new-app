import { apiRequest } from '@/lib/api/client';

export type WhopPaymentStatus = {
  id: string;
  kind: 'SUBSCRIPTION' | 'INVESTMENT' | 'POOL';
  status: 'PENDING' | 'PAID' | 'FAILED';
  targetId: string;
};

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
