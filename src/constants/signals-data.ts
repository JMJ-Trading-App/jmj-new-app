export type SignalSide = 'buy' | 'sell';

export type SignalStatus = 'active' | 'hit_tp' | 'hit_sl' | 'closed';

export type SignalProgressStep = {
  id: string;
  title: string;
  subtitle?: string;
  tone: 'done' | 'current' | 'pending';
};

export type TradeSignal = {
  id: string;
  asset: string;
  side: SignalSide;
  status: SignalStatus;
  entry: string;
  takeProfit: string;
  stopLoss: string;
  note: string;
  meaning: string;
  releasedLabel: string;
  progress: SignalProgressStep[];
};

export type SignalsAccessStatus = 'active' | 'ended';

export const SIGNALS_TABS = [
  { id: 'active', label: 'Active' },
  { id: 'history', label: 'History' },
] as const;

export type SignalsTab = (typeof SIGNALS_TABS)[number]['id'];

/** Flip to `'ended'` to preview the locked/non-active state. */
export const SIGNALS_ACCESS_STATUS: SignalsAccessStatus = 'active';

export const SIGNALS_PLAN = {
  name: 'Monthly plan',
  summary: '18 days left. Plan renews 24 June',
  manageLabel: 'Manage',
};

export const SIGNALS_ENDED = {
  title: 'Your Signals access ended',
  subtitle: "It ran out on 01 Sep. Renew to keep getting JMJ's trade calls.",
  cta: 'See Plans',
};

export const SIGNALS_INSIGHT = {
  hit: 9,
  total: 11,
  get label() {
    return `${this.hit} of ${this.total} signals hit target this month.`;
  },
};

export const ACTIVE_SIGNALS: TradeSignal[] = [
  {
    id: 'vol-10',
    asset: 'Vol 10 Index',
    side: 'buy',
    status: 'active',
    entry: '4751.093',
    takeProfit: '4757.077',
    stopLoss: '4749.021',
    note: 'Price reclaimed the H4 range. Looking for continuation into 4751.093.',
    meaning:
      'JMJ expects Vol 10 to rise. Buy near 4751.093, take profit at 4757.077, and exit if it drops to 4749.021',
    releasedLabel: 'Released 2h ago - 09.40',
    // Active: still running — outcome not reached yet
    progress: [
      { id: 'released', title: 'Released', subtitle: 'Today at 09:40', tone: 'done' },
      { id: 'running', title: 'Actively Running', tone: 'current' },
      { id: 'outcome', title: 'Hit Take profit', tone: 'pending' },
    ],
  },
  {
    id: 'vol-25',
    asset: 'Vol 25 Index',
    side: 'sell',
    status: 'active',
    entry: '2752.761',
    takeProfit: '2759.111',
    stopLoss: '2694.911',
    note: 'Rejection from the daily resistance. Targeting a move back into the mid-range.',
    meaning:
      'JMJ expects Vol 25 to fall. Sell near 2752.761, take profit at 2759.111, and exit if it rises to 2694.911',
    releasedLabel: 'Released 5h ago - 06.15',
    progress: [
      { id: 'released', title: 'Released', subtitle: 'Today at 06:15', tone: 'done' },
      { id: 'running', title: 'Actively Running', tone: 'current' },
      { id: 'outcome', title: 'Hit Take profit', tone: 'pending' },
    ],
  },
];

export const HISTORY_SIGNALS: TradeSignal[] = [
  {
    id: 'vol-10-closed',
    asset: 'Vol 10 Index',
    side: 'buy',
    status: 'hit_tp',
    entry: '4751.093',
    takeProfit: '4757.077',
    stopLoss: '4749.021',
    note: 'Price reclaimed the H4 range. Target reached into 4757.077.',
    meaning:
      'JMJ expects Vol 10 to rise. Buy near 4751.093, take profit at 4757.077, and exit if it drops to 4749.021',
    releasedLabel: 'Closed today - 11.44',
    // Non-active / completed — matches detail mock (running highlighted, TP hit)
    progress: [
      { id: 'released', title: 'Released', subtitle: 'Today at 09:40', tone: 'done' },
      { id: 'running', title: 'Actively Running', tone: 'current' },
      { id: 'outcome', title: 'Hit Take profit', subtitle: 'Today at 11:44', tone: 'done' },
    ],
  },
  {
    id: 'vol-75',
    asset: 'Vol 75 Index',
    side: 'buy',
    status: 'hit_tp',
    entry: '812.440',
    takeProfit: '820.110',
    stopLoss: '808.200',
    note: 'Breakout held above the session open. Target reached cleanly.',
    meaning:
      'JMJ expected Vol 75 to rise. Buy near 812.440, take profit at 820.110, and exit if it dropped to 808.200',
    releasedLabel: 'Closed yesterday - 14.20',
    progress: [
      { id: 'released', title: 'Released', subtitle: 'Yesterday at 09:10', tone: 'done' },
      { id: 'running', title: 'Actively Running', subtitle: 'Yesterday at 09:12', tone: 'done' },
      { id: 'outcome', title: 'Hit Take profit', subtitle: 'Yesterday at 14:20', tone: 'done' },
    ],
  },
];

export function getSignalById(id: string) {
  return [...ACTIVE_SIGNALS, ...HISTORY_SIGNALS].find((signal) => signal.id === id) ?? null;
}
