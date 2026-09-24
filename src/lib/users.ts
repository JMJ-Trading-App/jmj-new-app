import { apiRequest } from '@/lib/api/client';
import type { PublicUser } from '@/lib/api/types';
import { updateSessionUser } from '@/lib/session';

export async function fetchProfile() {
  const user = await apiRequest<PublicUser>('/users/profile', { auth: true });
  await updateSessionUser(user);
  return user;
}

export async function updateProfile(payload: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  country: string;
}) {
  const user = await apiRequest<PublicUser>('/users/profile', {
    method: 'PATCH',
    auth: true,
    body: {
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.replace(/\s/g, ''),
      dateOfBirth: payload.dateOfBirth,
      country: payload.country.trim(),
    },
  });
  await updateSessionUser(user);
  return user;
}
