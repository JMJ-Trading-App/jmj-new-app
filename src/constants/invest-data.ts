export type InvestFilter = 'all' | 'active' | 'pending' | 'completed';

export type InvestmentStatus = 'active' | 'pending' | 'completed';

export type InvestmentItem = {
  id: string;
  name: string;
  status: InvestmentStatus;
  invested: string;
  /** Current value for active/pending; final value for completed */
  value: string;
  valueLabel: 'Current Value' | 'Final Value';
  totalReturn: string;
  totalReturnPercent: string;
  returnPositive: boolean;
  duration: string;
  started: string;
  progress: number;
};

export type PortfolioSummary = {
  totalValueWhole: string;
  totalValueCents: string;
  invested: string;
  returns: string;
  returnsPositive: boolean;
  monthlyChange?: string;
  monthlyPositive?: boolean;
};

export const INVEST_FILTERS: { id: InvestFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Completed' },
];

export const INVEST_PORTFOLIO: PortfolioSummary = {
  totalValueWhole: '$14,098',
  totalValueCents: '.77',
  invested: '$6,500',
  returns: '+$7,598.77',
  returnsPositive: true,
  monthlyChange: '+20.40 this month',
  monthlyPositive: true,
};

export const INVESTMENTS: InvestmentItem[] = [
  {
    id: 'growth',
    name: 'Growth Fund',
    status: 'active',
    invested: '$500.00',
    value: '$510.20',
    valueLabel: 'Current Value',
    totalReturn: '+$10.20',
    totalReturnPercent: '+2.04%',
    returnPositive: true,
    duration: '3-5 weeks',
    started: 'Oct 14, 2024',
    progress: 40,
  },
  {
    id: 'starter',
    name: 'Starter Fund',
    status: 'completed',
    invested: '$200.00',
    value: '$215.40',
    valueLabel: 'Final Value',
    totalReturn: '+$15.40',
    totalReturnPercent: '+7.70%',
    returnPositive: true,
    duration: '2 weeks',
    started: 'Sep 2, 2024',
    progress: 100,
  },
  {
    id: 'income',
    name: 'Income Fund',
    status: 'pending',
    invested: '$1,000.00',
    value: '$1,000.00',
    valueLabel: 'Current Value',
    totalReturn: '$0.00',
    totalReturnPercent: '0%',
    returnPositive: true,
    duration: '4-6 weeks',
    started: 'Oct 20, 2024',
    progress: 5,
  },
];
