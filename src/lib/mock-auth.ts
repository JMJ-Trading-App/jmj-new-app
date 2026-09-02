type EmailAvailabilityResult = {
  available: boolean;
  message?: string;
};

const REGISTERED_EMAILS = new Set(["example@email.com"]);

let signupFirstName = '';
let signupLastName = '';

export function getSignupFirstName() {
  return signupFirstName;
}

export function getSignupLastName() {
  return signupLastName;
}

export function getSignupInitials() {
  const first = signupFirstName.trim().charAt(0);
  const last = signupLastName.trim().charAt(0);
  const initials = `${first}${last}`.toUpperCase();

  return initials || 'AB';
}

export async function checkEmailAvailability(
  email: string,
): Promise<EmailAvailabilityResult> {
  // Placeholder for a future backend check.
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const normalizedEmail = email.trim().toLowerCase();

  if (REGISTERED_EMAILS.has(normalizedEmail)) {
    return {
      available: false,
      message: "Email address is already registered.",
    };
  }

  return { available: true };
}

export async function submitSignUp(_payload: {
  email: string;
  phone: string;
  password: string;
}) {
  // Placeholder for a future sign-up API call.
  await new Promise((resolve) => setTimeout(resolve, 1200));
}

export async function verifyEmailCode(_email: string, _code: string) {
  // Placeholder for a future verification API call.
  await new Promise((resolve) => setTimeout(resolve, 1200));
}

export async function resendEmailCode(_email: string) {
  // Placeholder for a future resend API call.
  await new Promise((resolve) => setTimeout(resolve, 800));
}

export async function submitIdentity(payload: {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  confirmPassword?: string;
}) {
  signupFirstName = payload.firstName.trim();
  signupLastName = payload.lastName.trim();
  // Placeholder for a future identity submission API call.
  await new Promise((resolve) => setTimeout(resolve, 1200));
}

export async function submitPreferences(_payload: {
  experience: string;
  interests: string[];
}) {
  // Placeholder for a future preferences submission API call.
  await new Promise((resolve) => setTimeout(resolve, 1200));
}

export async function submitSecureAccount(_payload: {
  pin: string;
  biometricsEnabled: boolean;
}) {
  // Placeholder for a future secure account setup API call.
  await new Promise((resolve) => setTimeout(resolve, 1200));
}
