export function formatDateOfBirth(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function formatDateFromPicker(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());

  return `${day}/${month}/${year}`;
}

export function parseDateOfBirth(value: string) {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]) - 1;
  const year = Number(match[3]);
  const date = new Date(year, month, day);

  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return null;
  }

  return date;
}

export function getDefaultDateOfBirthPickerDate() {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 18);

  return date;
}

export function isCompleteDateOfBirth(value: string) {
  return parseDateOfBirth(value) !== null;
}

/** Convert DD/MM/YYYY UI value to ISO date (YYYY-MM-DD) for the API. */
export function toIsoDateString(value: string) {
  const date = parseDateOfBirth(value);
  if (!date) {
    throw new Error('Invalid date of birth');
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Convert API ISO / Date string to DD/MM/YYYY for form inputs. */
export function formatDobInputFromIso(value: string | null | undefined) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return formatDateFromPicker(date);
}

/** Friendly display e.g. Jan 15, 1995 */
export function formatDisplayDate(value: string | null | undefined) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
