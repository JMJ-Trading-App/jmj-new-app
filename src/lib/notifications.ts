import { apiRequest } from '@/lib/api/client';
import type {
  NotificationItemApi,
  NotificationsResponse,
} from '@/lib/api/types';

export async function fetchNotifications(category?: string) {
  const query =
    category && category !== 'all'
      ? `?category=${encodeURIComponent(category)}`
      : '';
  return apiRequest<NotificationsResponse>(`/notifications${query}`, {
    auth: true,
  });
}

export async function fetchUnreadNotificationCount() {
  return apiRequest<{ unreadCount: number }>('/notifications/unread-count', {
    auth: true,
  });
}

export async function markNotificationRead(id: string) {
  return apiRequest<NotificationItemApi>(`/notifications/${id}/read`, {
    method: 'PATCH',
    auth: true,
  });
}

export async function markAllNotificationsRead() {
  return apiRequest<{ message: string; updated: number }>(
    '/notifications/read-all',
    {
      method: 'PATCH',
      auth: true,
    },
  );
}
