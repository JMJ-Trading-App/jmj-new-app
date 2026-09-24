import { apiRequest } from '@/lib/api/client';

export async function registerPushToken(token: string, platform?: string) {
  return apiRequest<{ message: string; token: string }>('/notifications/push-token', {
    method: 'POST',
    auth: true,
    body: { token, platform },
  });
}

export async function unregisterPushToken(token: string) {
  return apiRequest<{ message: string }>('/notifications/push-token', {
    method: 'DELETE',
    auth: true,
    body: { token },
  });
}
