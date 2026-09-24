import { apiRequest } from '@/lib/api/client';
import type { OccupationOptions, OccupationResponse } from '@/lib/api/types';
import { updateSessionUser } from '@/lib/session';

export async function fetchOccupationOptions() {
  return apiRequest<OccupationOptions>('/occupation/options');
}

export async function fetchOccupation() {
  return apiRequest<OccupationResponse>('/occupation', { auth: true });
}

export async function saveOccupation(payload: {
  industry: string;
  occupation: string;
  sourceOfFunds: string;
  annualIncome: string;
}) {
  const result = await apiRequest<OccupationResponse>('/occupation', {
    method: 'PUT',
    auth: true,
    body: payload,
  });
  if (result.user) {
    await updateSessionUser(result.user);
  }
  return result;
}
