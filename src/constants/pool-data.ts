export type PoolFilter = 'all' | 'active' | 'upcoming' | 'completed';

export type PoolStatus = 'active' | 'upcoming' | 'completed';

export type PoolMemberPosition = {
  contributed: string;
  currentValue: string;
  earnings: string;
  returnPercent: string;
  poolCurrentReturn: string;
  poolEarnings: string;
  totalParticipants: string;
  startDate: string;
  endDate: string;
  profitSplit: string;
  poolTarget: string;
  completedOn?: string;
};

export type PoolItem = {
  id: string;
  name: string;
  status: PoolStatus;
  shortDescription: string;
  about: string;
  duration: string;
  minContribution: string;
  minContributionValue: number;
  contributorsLabel: string;
  contributorsJoined: number;
  contributorsNeeded: number;
  raisedLabel: string;
  raisedProgress: number;
  joinProgress: number;
  poolSize: string;
  returns: string;
  opensIn?: string;
  targetLabel?: string;
  returnLabel?: string;
  yourEarnings?: string;
  position?: PoolMemberPosition;
  gains: string[];
  ctaLabel: string;
  notifySet?: boolean;
};

export type PoolSummary = {
  totalWhole: string;
  totalCents: string;
  contributed: string;
  earnings: string;
  earningsPositive: boolean;
};

export const POOL_FILTERS: { id: PoolFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
];

export const POOL_SUMMARY: PoolSummary = {
  totalWhole: '$4,500',
  totalCents: '.00',
  contributed: '$4,000',
  earnings: '$500.00',
  earningsPositive: true,
};

export const POOLS: PoolItem[] = [
  {
    id: 'alpha-growth',
    name: 'Alpha Growth Pool',
    status: 'active',
    shortDescription:
      'Collective investment pool with professional risk management and diversified strategies.',
    about:
      'A fixed-contribution pool where each investor puts in $200. Once 20 investors join, the pool is complete and JMJ deploys diversified trading strategies on MetaTrader, spreading risk across positions.',
    duration: '8 weeks',
    minContribution: '$200',
    minContributionValue: 200,
    contributorsLabel: '24',
    contributorsJoined: 24,
    contributorsNeeded: 24,
    raisedLabel: '$100,000 raised',
    raisedProgress: 100,
    joinProgress: 100,
    poolSize: '$100,000',
    returns: '162%',
    returnLabel: '+162%',
    yourEarnings: '+$1,620.00',
    position: {
      contributed: '$4,000',
      currentValue: '$5,620',
      earnings: '+$1,620.00',
      returnPercent: '+162%',
      poolCurrentReturn: '+38.5%',
      poolEarnings: '+$38,500',
      totalParticipants: '24',
      startDate: 'Jul 15, 2026',
      endDate: 'Sep 9, 2026',
      profitSplit: '55% You / 45% JMJ',
      poolTarget: '$100,000',
    },
    gains: [
      'Diversified risk across multiple strategies',
      'Lower minimum entry compared to individual investment',
      'Professional portfolio management',
      'Proportional profit distribution',
    ],
    ctaLabel: 'Follow up on WhatsApp',
  },
  {
    id: 'momentum',
    name: 'Momentum Pool',
    status: 'active',
    shortDescription:
      'Collective investment pool with professional risk management and diversified strategies.',
    about:
      'A fixed-contribution pool where each investor puts in $200. Once 20 investors join, the pool is complete and JMJ deploys diversified trading strategies on MetaTrader, spreading risk across positions.',
    duration: '8 weeks',
    minContribution: '$200',
    minContributionValue: 200,
    contributorsLabel: '20',
    contributorsJoined: 13,
    contributorsNeeded: 20,
    raisedLabel: '$8,600 raised',
    raisedProgress: 86,
    joinProgress: 65,
    poolSize: '$4,000',
    returns: '150%',
    gains: [
      'Diversified risk across multiple strategies',
      'Lower minimum entry compared to individual investment',
      'Professional portfolio management',
      'Proportional profit distribution',
    ],
    ctaLabel: 'Join Pool',
  },
  {
    id: 'stability',
    name: 'Stability Pool',
    status: 'upcoming',
    shortDescription:
      'Conservative pooled fund focusing on capital preservation with steady returns.',
    about:
      'A conservative fixed-contribution pool focused on capital preservation. Once the target investor count is met, JMJ deploys lower-volatility strategies on MetaTrader.',
    duration: '12 weeks',
    minContribution: '$250',
    minContributionValue: 250,
    contributorsLabel: 'Target: $50,000',
    contributorsJoined: 0,
    contributorsNeeded: 40,
    raisedLabel: '$0 raised',
    raisedProgress: 0,
    joinProgress: 0,
    poolSize: '$10,000',
    returns: '120%',
    opensIn: 'Opens in 3 days',
    targetLabel: '$50k',
    gains: [
      'Capital-preservation focused strategy',
      'Steady return profile',
      'Shared risk across contributors',
      'Professional portfolio management',
    ],
    ctaLabel: 'Notify Me',
  },
  {
    id: 'stability-completed',
    name: 'Stability Pool',
    status: 'completed',
    shortDescription:
      'Conservative pooled fund focusing on capital preservation with steady returns.',
    about:
      'This pool cycle has closed. Capital was deployed with a capital-preservation focus and profits were distributed proportionally to contributors.',
    duration: '6 weeks',
    minContribution: '$250',
    minContributionValue: 250,
    contributorsLabel: '18',
    contributorsJoined: 18,
    contributorsNeeded: 18,
    raisedLabel: '$75,000 raised',
    raisedProgress: 100,
    joinProgress: 100,
    poolSize: '$75,000',
    returns: '27.2%',
    returnLabel: '+27.2%',
    yourEarnings: '+$680.00',
    position: {
      contributed: '$2,500',
      currentValue: '$3,180',
      earnings: '+$680.00',
      returnPercent: '+27.2%',
      poolCurrentReturn: '+24.8%',
      poolEarnings: '+$18,600',
      totalParticipants: '18',
      startDate: 'Jul 8, 2026',
      endDate: 'Aug 20, 2026',
      profitSplit: '55% You / 45% JMJ',
      poolTarget: '$75,000',
      completedOn: 'Aug 20, 2026',
    },
    gains: [
      'Capital-preservation focused strategy',
      'Steady return profile',
      'Shared risk across contributors',
      'Professional portfolio management',
    ],
    ctaLabel: 'View Details',
  },
];

export function getPoolById(id: string) {
  return POOLS.find((pool) => pool.id === id);
}

export const POOL_SERVICE_CHARGE_RATE = 0.035; // 3.5%
export const POOL_EXPECTED_PROFIT_TARGET = 1.75; // 175% profit target from help copy

export function parsePoolSize(poolSize: string) {
  return Number(poolSize.replace(/[^0-9.]/g, '')) || 0;
}

export function getPoolJoinProjection(contribution: number, poolSize: number) {
  const serviceCharge = contribution * POOL_SERVICE_CHARGE_RATE;
  const totalToPay = contribution + serviceCharge;
  const expectedProfit = contribution * (1 + POOL_EXPECTED_PROFIT_TARGET);
  const sharePercent = poolSize > 0 ? (contribution / poolSize) * 100 : 0;

  return {
    contribution,
    serviceCharge,
    totalToPay,
    expectedProfit,
    sharePercent,
  };
}
