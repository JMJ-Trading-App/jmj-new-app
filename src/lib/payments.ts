import { apiUpload } from '@/lib/api/client';
import type { PaymentUploadResult } from '@/lib/api/types';

export async function uploadPaymentProof(file: {
  uri: string;
  name: string;
  type: string;
}) {
  return apiUpload<PaymentUploadResult>('/payments/uploads', file);
}
