export type PublicUser = {
  id: string;
  email: string;
  phone: string | null;
  emailVerifiedAt: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  initials: string;
  dateOfBirth: string | null;
  country: string | null;
  accountId: string;
  kycStatus: 'PENDING' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED' | string;
  planTier: string;
  planLabel: string;
  experience: string | null;
  interests: string[];
  biometricsEnabled: boolean;
  pinSet?: boolean;
  industry: string | null;
  occupation: string | null;
  sourceOfFunds: string | null;
  annualIncome: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  user: PublicUser;
};

export type EmailAvailabilityResult = {
  available: boolean;
  message?: string;
};

export type OccupationOptions = {
  industry: { id: string; label: string }[];
  occupation: { id: string; label: string }[];
  sourceOfFunds: { id: string; label: string }[];
  annualIncome: { id: string; label: string }[];
};

export type OccupationResponse = {
  industry: string | null;
  occupation: string | null;
  sourceOfFunds: string | null;
  annualIncome: string | null;
  labels: {
    industry: string | null;
    occupation: string | null;
    sourceOfFunds: string | null;
    annualIncome: string | null;
  };
  user?: PublicUser;
};

export type KycDocumentSlot = 'ID_FRONT' | 'ID_BACK' | 'SELFIE' | 'ADDRESS';

export type KycUploadResult = {
  fileUrl: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  storedAs: string;
};

export type KycStatusResponse = {
  kycStatus: string;
  provider: string;
  canSubmit: boolean;
  latestSubmission: unknown | null;
  user: PublicUser;
};

export type PaymentUploadResult = {
  fileUrl: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  storedAs: string;
};

export type PaymentMethodApi = 'BANK' | 'BTC' | 'ETH';

export type InvestmentItemApi = {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'completed';
  invested: string;
  investedUsd: number;
  value: string;
  valueUsd: number;
  valueLabel: 'Current Value' | 'Final Value';
  totalReturn: string;
  totalReturnPercent: string;
  returnPositive: boolean;
  duration: string;
  started: string;
  progress: number;
  paymentReference: string | null;
};

export type InvestPortfolioResponse = {
  portfolio: {
    totalValue: number;
    totalValueWhole: string;
    totalValueCents: string;
    invested: string;
    returns: string;
    returnsPositive: boolean;
  };
  investments: InvestmentItemApi[];
};

export type InvestOptionsResponse = {
  minDeposit: number;
  defaultDeposit: number;
  depositPresets: number[];
  serviceChargeRate: number;
  profitTargetRate: number;
  userProfitShare: number;
  riskLevels: {
    id: string;
    label: string;
    description: string;
    showContact?: boolean;
  }[];
  paymentInstructions: {
    bank: {
      bankName: string;
      accountName: string;
      accountNumber: string;
    };
    btc: {
      network: string;
      walletAddress: string;
      amountBtcHint: string;
    };
    eth: {
      network: string;
      walletAddress: string;
      amountEthHint: string;
    };
  };
};

export type WhopCheckoutApi = {
  mode: 'mock' | 'whop';
  paymentId: string;
  url: string | null;
};

export type CreateInvestmentResponse = {
  message: string;
  investment: InvestmentItemApi;
  paymentReference: string;
  serviceChargeUsd: number;
  serviceCharge: string;
  checkout?: WhopCheckoutApi;
};

export type PoolItemApi = {
  id: string;
  name: string;
  status: 'active' | 'upcoming' | 'completed';
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
  position?: {
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
  gains: string[];
  ctaLabel: string;
  membershipStatus: 'pending' | 'active' | 'completed' | null;
  myMembership: {
    id: string;
    poolId: string;
    status: string;
    contributionUsd: number;
    serviceChargeUsd: number;
    totalPaidUsd: number;
    paymentReference: string | null;
  } | null;
};

export type PoolListResponse = {
  summary: {
    totalWhole: string;
    totalCents: string;
    contributed: string;
    earnings: string;
    earningsPositive: boolean;
  };
  pools: PoolItemApi[];
};

export type JoinPoolResponse = {
  message: string;
  membership: {
    id: string;
    poolId: string;
    status: string;
    paymentReference: string | null;
    serviceChargeUsd: number;
  };
  paymentReference: string;
  serviceChargeUsd: number;
  serviceCharge: string;
  checkout?: WhopCheckoutApi;
  pool: PoolItemApi;
};

export type SubscriptionPlanApi = {
  id: string;
  category: 'signals' | 'classes';
  name: string;
  duration: string;
  durationDays: number;
  price: string;
  priceUsd: number;
  billingLabel: string;
  badgeTier: 'basic' | 'pro' | 'vip';
  features: string[];
  popular: boolean;
};

export type SubscriptionPlansResponse = {
  paymentMethod: string;
  plans: SubscriptionPlanApi[];
  signals: SubscriptionPlanApi[];
  classes: SubscriptionPlanApi[];
};

export type SubscriptionApi = {
  id: string;
  planId: string;
  category: 'signals' | 'classes';
  status: string;
  amountUsd: number;
  amount: string;
  startsAt: string | null;
  endsAt: string | null;
  daysLeft: number;
  reference: string | null;
  paymentProvider: string;
  planName: string;
  billingLabel: string;
  badgeTier: string;
  duration: string;
};

export type CheckoutResponse = {
  message: string;
  payment: {
    mode: 'mock' | 'paystack' | 'whop';
    reference: string;
    authorizationUrl: string | null;
    accessCode: string | null;
  };
  subscription: SubscriptionApi;
  user: PublicUser;
};

export type SignalsFeedResponse = {
  access: 'active' | 'ended';
  plan: {
    name: string;
    summary: string;
    manageLabel: string;
    daysLeft: number;
    planId: string;
    billingLabel: string;
  } | null;
  endedOn: string | null;
  insight: { hit: number; total: number; label: string };
  active: TradeSignalApi[];
  history: TradeSignalApi[];
};

export type TradeSignalApi = {
  id: string;
  asset: string;
  side: 'buy' | 'sell';
  status: 'active' | 'hit_tp' | 'hit_sl' | 'closed';
  entry: string;
  takeProfit: string;
  stopLoss: string;
  note: string;
  meaning: string;
  releasedLabel: string;
  progress: {
    id: string;
    title: string;
    subtitle?: string;
    tone: 'done' | 'current' | 'pending';
  }[];
};

export type ClassesFeedResponse = {
  hasActiveSubscription: boolean;
  subscription: { planId: string; planName: string; endsAt: string | null } | null;
  classes: TradingClassApi[];
};

export type TradingClassApi = {
  id: string;
  platform: string;
  status: 'live' | 'upcoming';
  tier: 'Free' | 'Pro' | 'VIP';
  title: string;
  description: string;
  schedule: string;
  action: 'join' | 'remind' | 'reminded';
  joinUrl?: string | null;
  canAccess?: boolean;
};

export type NotificationItemApi = {
  id: string;
  title: string;
  body: string;
  time: string;
  category: 'account' | 'investment' | 'pools';
  unread: boolean;
  icon:
    | 'kyc'
    | 'funded'
    | 'payout'
    | 'pool-complete'
    | 'investment-confirmed'
    | 'new-pool'
    | 'withdrawal';
  section: 'today' | 'yesterday' | 'earlier';
  href?: string | null;
  createdAt: string;
};

export type NotificationsResponse = {
  unreadCount: number;
  notifications: NotificationItemApi[];
};
