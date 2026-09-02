export type ProfileField = {
  label: string;
  value: string;
};

export type ProfileAccountField = ProfileField & {
  copyable?: boolean;
  badge?: {
    label: string;
    tone: 'success' | 'pending';
  };
};

export const PROFILE = {
  fullName: 'Ayomide Bakare',
  email: 'ayomide@email.com',
  initials: 'AB',
  planLabel: 'Free',
  planTier: 'basic' as const,
  personal: [
    { label: 'Full Name', value: 'Ayomide Bakare' },
    { label: 'Email Address', value: 'ayomide@email.com' },
    { label: 'Phone Number', value: '+234 801 234 5678' },
    { label: 'Date of Birth', value: 'Jan 15, 1995' },
    { label: 'Country', value: 'Nigeria' },
  ] satisfies ProfileField[],
  account: [
    {
      label: 'Account ID',
      value: 'JMJ-2026-0847',
      copyable: true,
    },
    {
      label: 'KYC Status',
      value: 'Pending Verification',
      badge: { label: 'Verified', tone: 'success' },
    },
  ] satisfies ProfileAccountField[],
};
