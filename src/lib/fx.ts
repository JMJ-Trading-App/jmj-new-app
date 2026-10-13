import { apiRequest } from '@/lib/api/client';

import type { FxRates } from '@/lib/fx-quote';

export async function fetchFxRates() {
  return apiRequest<FxRates>('/fx/rates', { auth: true });
}
