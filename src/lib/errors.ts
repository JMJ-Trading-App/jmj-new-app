import { ApiError } from '@/lib/api/client';
import { toastError, toastSuccess } from '@/lib/toast';

export function getErrorMessage(error: unknown, fallback = 'Something went wrong') {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

/** Show an error toast. `title` is optional context (e.g. "Sign in failed"). */
export function alertError(error: unknown, title = 'Error') {
  toastError(getErrorMessage(error), title);
}

export function alertSuccess(message: string, title = 'Success') {
  toastSuccess(message, title);
}
