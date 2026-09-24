import { apiRequest } from '@/lib/api/client';
import type {
  AuthResponse,
  EmailAvailabilityResult,
  PublicUser,
} from '@/lib/api/types';
import { getCachedUser, setSession, updateSessionUser } from '@/lib/session';
import { markUnlocked, saveLocalUnlockCredentials } from '@/lib/lock';

export function getSignupFirstName() {
  return getCachedUser()?.firstName?.trim() ?? '';
}

export function getSignupLastName() {
  return getCachedUser()?.lastName?.trim() ?? '';
}

export function getSignupInitials() {
  const user = getCachedUser();
  if (user?.initials) return user.initials;
  const first = getSignupFirstName().charAt(0);
  const last = getSignupLastName().charAt(0);
  return `${first}${last}`.toUpperCase() || 'JM';
}

export async function checkEmailAvailability(
  email: string,
): Promise<EmailAvailabilityResult> {
  const query = encodeURIComponent(email.trim().toLowerCase());
  return apiRequest<EmailAvailabilityResult>(
    `/auth/email-available?email=${query}`,
  );
}

export async function submitSignUp(payload: {
  email: string;
  phone: string;
  password: string;
}) {
  return apiRequest<{ message: string; email: string; debugCode?: string }>(
    '/auth/register',
    {
      method: 'POST',
      body: {
        email: payload.email.trim().toLowerCase(),
        phone: payload.phone.replace(/\s/g, ''),
        password: payload.password,
      },
    },
  );
}

export async function verifyEmailCode(email: string, code: string) {
  const result = await apiRequest<AuthResponse>('/auth/verify-email', {
    method: 'POST',
    body: {
      email: email.trim().toLowerCase(),
      code: code.trim(),
    },
  });
  await setSession(result.accessToken, result.user);
  markUnlocked();
  return result;
}

export async function resendEmailCode(email: string) {
  return apiRequest<{ message: string; debugCode?: string }>('/auth/resend-code', {
    method: 'POST',
    body: { email: email.trim().toLowerCase() },
  });
}

export async function login(payload: { email: string; password: string }) {
  const result = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: {
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    },
  });
  await setSession(result.accessToken, result.user);
  markUnlocked();
  return result;
}

export async function fetchMe() {
  const user = await apiRequest<PublicUser>('/auth/me', { auth: true });
  await updateSessionUser(user);
  return user;
}

export async function submitIdentity(payload: {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}) {
  const user = await apiRequest<PublicUser>('/users/identity', {
    method: 'PATCH',
    auth: true,
    body: {
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      dateOfBirth: payload.dateOfBirth,
    },
  });
  await updateSessionUser(user);
  return user;
}

export async function submitPreferences(payload: {
  experience: string;
  interests: string[];
}) {
  const user = await apiRequest<PublicUser>('/users/preferences', {
    method: 'PATCH',
    auth: true,
    body: payload,
  });
  await updateSessionUser(user);
  return user;
}

export async function submitSecureAccount(payload: {
  pin: string;
  biometricsEnabled: boolean;
}) {
  const user = await apiRequest<PublicUser>('/users/secure-account', {
    method: 'PATCH',
    auth: true,
    body: payload,
  });
  await saveLocalUnlockCredentials({
    pin: payload.pin,
    biometricsEnabled: payload.biometricsEnabled,
  });
  await updateSessionUser(user);
  markUnlocked();
  return user;
}

export async function verifyPin(pin: string) {
  return apiRequest<{ valid: true }>('/users/verify-pin', {
    method: 'POST',
    auth: true,
    body: { pin },
  });
}
