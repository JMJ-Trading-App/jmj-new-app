export type SubscriptionCategory = 'signals' | 'classes';

export type SubscriptionPlan = {
  id: string;
  category: SubscriptionCategory;
  name: string;
  duration: string;
  price: string;
  billingLabel: string;
  features: string[];
  badgeTier: 'basic' | 'pro' | 'vip';
  popular?: boolean;
};

export const SUBSCRIPTION_TABS = [
  { id: 'signals', label: 'Signals' },
  { id: 'classes', label: 'Classes' },
] as const;

export const SUBSCRIPTION_PAYMENT_METHOD = 'Paystack';

export const SIGNAL_PLAN_BENEFITS = {
  label: 'WITH A PLAN YOU GET',
  body: "Every members-only signal the moment it's released, the analyst note behind each call, and a notification when a trade hits target or stop.",
};

export const SIGNAL_PLAN_FOOTNOTE =
  "One payment for the period you pick. No auto charge, we'll remind you before it ends.";

export const SIGNAL_PLANS: SubscriptionPlan[] = [
  {
    id: 'signals-weekly',
    category: 'signals',
    name: 'Weekly',
    duration: '(7 days)',
    price: '$14.99',
    billingLabel: '$14.99/week',
    badgeTier: 'basic',
    features: ['2 signals / day', 'Technical Analysis'],
  },
  {
    id: 'signals-monthly',
    category: 'signals',
    name: 'Monthly',
    duration: '(30 days)',
    price: '$54.99',
    billingLabel: '$54.99/month',
    badgeTier: 'pro',
    features: ['2 signals / day', 'Technical Analysis'],
    popular: true,
  },
];

export const CLASS_PLANS: SubscriptionPlan[] = [
  {
    id: 'classes-pro',
    category: 'classes',
    name: 'Pro',
    duration: '(1 month)',
    price: '$89.99',
    billingLabel: '$89.99/month',
    badgeTier: 'pro',
    features: [
      'Group-based trading class',
      'Multiple students can attend',
      'Access to scheduled group classes',
      'Class links become available to active members',
    ],
  },
  {
    id: 'classes-vip',
    category: 'classes',
    name: 'VIP',
    duration: '(6 weeks)',
    price: '$54.99',
    billingLabel: '$54.99/month',
    badgeTier: 'vip',
    features: [
      'Private one-on-one mentorship',
      'Dedicated private sessions',
      'Access to VIP classes and mentorship sessions',
      'Private class links',
    ],
  },
];

export function getPlansForCategory(category: SubscriptionCategory) {
  return category === 'signals' ? SIGNAL_PLANS : CLASS_PLANS;
}

export function getPlanById(id: string) {
  return [...SIGNAL_PLANS, ...CLASS_PLANS].find((plan) => plan.id === id) ?? null;
}

export function getSubscriptionSuccessCopy(category: SubscriptionCategory) {
  if (category === 'classes') {
    return 'Your class subscription is active. Let’s get you learning smarter.';
  }

  return 'Your signals subscription is active. Let’s get you trading smarter.';
}
