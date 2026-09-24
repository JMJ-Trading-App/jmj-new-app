import { apiRequest } from '@/lib/api/client';
import type { ClassesFeedResponse } from '@/lib/api/types';
import type { ClassAction } from '@/constants/trading-classes-data';

export async function fetchClasses() {
  return apiRequest<ClassesFeedResponse>('/classes', { auth: true });
}

export async function toggleClassRemind(id: string) {
  return apiRequest<{
    message: string;
    action: ClassAction;
    reminded: boolean;
  }>(`/classes/${id}/remind`, {
    method: 'POST',
    auth: true,
  });
}
