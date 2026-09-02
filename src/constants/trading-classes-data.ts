export type ClassStatus = 'live' | 'upcoming';

export type ClassAction = 'join' | 'remind' | 'reminded';

export type TradingClass = {
  id: string;
  platform: string;
  status: ClassStatus;
  tier: 'Free' | 'Pro' | 'VIP';
  title: string;
  description: string;
  schedule: string;
  action: ClassAction;
};

export const TRADING_CLASSES: TradingClass[] = [
  {
    id: 'crypto-advanced',
    platform: 'Zoom Webinar',
    status: 'live',
    tier: 'Free',
    title: 'Advanced Crypto Trading',
    description:
      'Master the order books, identify liquidity sweeps, and leverage custom indicators like a seasoned pro.',
    schedule: 'Sep 10, 2026 • 2:00 PM WAT',
    action: 'join',
  },
  {
    id: 'forex-basics',
    platform: 'Google Meet',
    status: 'upcoming',
    tier: 'Pro',
    title: 'Forex Basics 101',
    description:
      'Understand global currency pairs, leverage strategies, and basic pips calculation for beginner day trading.',
    schedule: 'Sep 10, 2026 • 2:00 PM WAT',
    action: 'remind',
  },
  {
    id: 'stock-fundamentals',
    platform: 'YouTube Live',
    status: 'upcoming',
    tier: 'VIP',
    title: 'Stock Market Fundamentals',
    description:
      'A complete guide on evaluating balance sheets, fundamental analysis, and long-term equity growth mapping.',
    schedule: 'Sep 12, 2026 • 6:00 PM WAT',
    action: 'reminded',
  },
];
