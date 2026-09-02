export type KycRequirement = {
  id: string;
  title: string;
  description: string;
  icon: 'id' | 'selfie' | 'address';
};

export type KycDocumentType = {
  id: string;
  label: string;
};

export const KYC_FLOW_STEPS = 3;

export const KYC_INTRO = {
  title: 'Verify Your Identity',
  notice:
    'Complete verification to unlock investments, pool funding, and withdrawals. This usually takes 1–2 business days.',
  sectionTitle: "WHAT YOU'LL NEED",
  cta: 'Start Verification',
};

export const KYC_REQUIREMENTS: KycRequirement[] = [
  {
    id: 'government-id',
    title: 'Government-Issued ID',
    description: 'NIN, Drivers License, Intl Passport, or Voters Card',
    icon: 'id',
  },
  {
    id: 'selfie',
    title: 'Selfie Photo',
    description: 'A clear photo of your face for identity match',
    icon: 'selfie',
  },
  {
    id: 'address',
    title: 'Proof of Address',
    description: 'Utility bill or bank statement (last 3 months)',
    icon: 'address',
  },
];

export const KYC_DOCUMENT_TYPES: KycDocumentType[] = [
  { id: 'nin', label: 'NIN' },
  { id: 'drivers-license', label: 'Drivers License' },
  { id: 'intl-passport', label: 'Intl Passport' },
  { id: 'voters-card', label: 'Voters Card' },
];

export const KYC_ADDRESS_DOCUMENT_TYPES: KycDocumentType[] = [
  { id: 'utility-bill', label: 'Utility Bill' },
  { id: 'bank-statement', label: 'Bank Statement' },
  { id: 'tenancy-agreement', label: 'Tenancy Agreement' },
  { id: 'government-letter', label: 'Government Letter' },
];

export const KYC_SELFIE_TIPS = [
  'Position your face within the frame',
  'Ensure good lighting',
  'Remove glasses or face coverings',
] as const;
