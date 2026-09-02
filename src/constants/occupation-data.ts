export type OccupationFieldId = 'industry' | 'occupation' | 'sourceOfFunds' | 'annualIncome';

export type OccupationOption = {
  id: string;
  label: string;
};

export const INDUSTRY_OPTIONS: OccupationOption[] = [
  { id: 'finance', label: 'Finance' },
  { id: 'technology', label: 'Technology' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'education', label: 'Education' },
  { id: 'oil-gas', label: 'Oil & Gas' },
  { id: 'agriculture', label: 'Agriculture' },
  { id: 'other', label: 'Other' },
];

export const OCCUPATION_OPTIONS: OccupationOption[] = [
  { id: 'entrepreneur', label: 'Entrepreneur' },
  { id: 'employee', label: 'Employee' },
  { id: 'freelancer', label: 'Freelancer' },
  { id: 'student', label: 'Student' },
  { id: 'retired', label: 'Retired' },
  { id: 'other', label: 'Other' },
];

export const SOURCE_OF_FUNDS_OPTIONS: OccupationOption[] = [
  { id: 'salary', label: 'Salary/Wages' },
  { id: 'business', label: 'Business Income' },
  { id: 'investments', label: 'Investments' },
  { id: 'inheritance', label: 'Inheritance' },
  { id: 'gift', label: 'Gift' },
  { id: 'other', label: 'Other' },
];

export const ANNUAL_INCOME_OPTIONS: OccupationOption[] = [
  { id: '0-1k', label: '$0 - $1,000' },
  { id: '1k-5k', label: '$1,000 - $5,000' },
  { id: '5k-20k', label: '$5,000 - $20,000' },
  { id: '20k-50k', label: '$20,000 - $50,000' },
  { id: '50k-100k', label: '$50,000 - $100,000' },
  { id: '100k-plus', label: '$100,000 and above' },
];

export const OCCUPATION_FIELDS: {
  id: OccupationFieldId;
  label: string;
  options: OccupationOption[];
}[] = [
  { id: 'industry', label: 'Industry', options: INDUSTRY_OPTIONS },
  { id: 'occupation', label: 'Occupation', options: OCCUPATION_OPTIONS },
  { id: 'sourceOfFunds', label: 'Source of funds', options: SOURCE_OF_FUNDS_OPTIONS },
  { id: 'annualIncome', label: 'Annual income', options: ANNUAL_INCOME_OPTIONS },
];

export const DEFAULT_OCCUPATION_VALUES: Record<OccupationFieldId, string> = {
  industry: 'finance',
  occupation: 'entrepreneur',
  sourceOfFunds: 'salary',
  annualIncome: '5k-20k',
};
