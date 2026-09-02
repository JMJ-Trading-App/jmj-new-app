export type PasswordChecks = {
  minLength: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
  matches: boolean;
};

export type PasswordRule = {
  id: keyof PasswordChecks;
  label: string;
};

export const PASSWORD_RULES: PasswordRule[] = [
  { id: 'minLength', label: 'At least 8 characters' },
  { id: 'uppercase', label: 'At least 1 uppercase letter (A–Z)' },
  { id: 'lowercase', label: 'At least 1 lowercase letter (a–z)' },
  { id: 'number', label: 'At least 1 number (0–9)' },
  { id: 'special', label: 'At least 1 special character (e.g. ! @ # $ %)' },
  { id: 'matches', label: 'Password matches' },
];

export function getPasswordChecks(password: string, confirmPassword: string): PasswordChecks {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password),
    matches: password.length > 0 && password === confirmPassword,
  };
}

export function isPasswordValid(checks: PasswordChecks) {
  return PASSWORD_RULES.every((rule) => checks[rule.id]);
}

export function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 10);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 7) {
    return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  }

  return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
}
