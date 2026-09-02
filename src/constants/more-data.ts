export type MoreBadgeVariant = 'pending' | 'comingSoon' | 'status';

export type MoreIconId =
  | 'profile'
  | 'kyc'
  | 'notifications'
  | 'occupation'
  | 'payout'
  | 'password'
  | 'twoFactor'
  | 'tradingClasses'
  | 'signals'
  | 'lucky6'
  | 'help'
  | 'whatsapp'
  | 'terms'
  | 'privacy';

export type MoreMenuItem = {
  id: string;
  label: string;
  icon: MoreIconId;
  href?: string;
  action?: 'whatsapp' | 'noop';
  badge?: {
    label: string;
    variant: MoreBadgeVariant;
  };
};

export type MoreMenuSection = {
  id: string;
  title: string;
  items: MoreMenuItem[];
};

export const MORE_PLAN_BADGE = {
  label: 'Free',
  tier: 'basic' as const,
};

export const MORE_UPGRADE = {
  title: 'Upgrade your plan',
  subtitle: 'Unlock exclusive trading signals, trading classes, and priority support',
  cta: 'Upgrade',
};

export const MORE_SECTIONS: MoreMenuSection[] = [
  {
    id: 'account',
    title: 'ACCOUNT',
    items: [
      { id: 'profile', label: 'Your Profile', icon: 'profile', href: '/profile' },
      {
        id: 'kyc',
        label: 'KYC Verification',
        icon: 'kyc',
        href: '/kyc',
        badge: { label: 'Pending', variant: 'pending' },
      },
      {
        id: 'notifications',
        label: 'Notifications',
        icon: 'notifications',
        href: '/notifications',
      },
      { id: 'occupation', label: 'Occupation & Source of Funds', icon: 'occupation', href: '/occupation' },
      { id: 'payout', label: 'Payout Account', icon: 'payout', href: '/payout-account' },
    ],
  },
  {
    id: 'security',
    title: 'SECURITY',
    items: [
      { id: 'password', label: 'Change Password', icon: 'password', href: '/change-password' },
      {
        id: 'two-factor',
        label: 'Two-Factor Authentication',
        icon: 'twoFactor',
        href: '/two-factor',
        badge: { label: 'Off', variant: 'status' },
      },
    ],
  },
  {
    id: 'others',
    title: 'OTHERS',
    items: [
      { id: 'trading-classes', label: 'Trading Classes', icon: 'tradingClasses', href: '/trading-classes' },
      { id: 'signals', label: 'Signals', icon: 'signals', href: '/signals' },
      {
        id: 'lucky-6',
        label: 'JMJ Lucky 6',
        icon: 'lucky6',
        badge: { label: 'Coming Soon', variant: 'comingSoon' },
      },
    ],
  },
  {
    id: 'support',
    title: 'SUPPORT',
    items: [
      { id: 'help', label: 'Help Center', icon: 'help', href: '/help-center' },
      {
        id: 'whatsapp',
        label: 'Contact Us on WhatsApp',
        icon: 'whatsapp',
        action: 'whatsapp',
      },
    ],
  },
  {
    id: 'legal',
    title: 'LEGAL',
    items: [
      { id: 'terms', label: 'Terms of Service', icon: 'terms' },
      { id: 'privacy', label: 'Privacy Policy', icon: 'privacy' },
    ],
  },
];

export const MORE_APP_VERSION = 'JMJ v2.0.1';
