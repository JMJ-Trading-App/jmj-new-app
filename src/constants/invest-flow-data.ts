export type RiskLevelId = 'moderate' | 'conservative' | 'exclusive';

export type RiskLevelOption = {
  id: RiskLevelId;
  label: string;
  description: string;
  showContact?: boolean;
};

export const INVEST_FLOW_STEPS = 4;

export const RISK_LEVELS: RiskLevelOption[] = [
  {
    id: 'moderate',
    label: 'Moderate',
    description: 'Suggested for $2,500 - $6,000 deposits',
  },
  {
    id: 'conservative',
    label: 'Conservative',
    description: 'Suggested for $6,000 - $10,000 deposits',
  },
  {
    id: 'exclusive',
    label: 'Exclusive',
    description: 'Beyond $10,000 · Personalized handling for larger investments',
    showContact: true,
  },
];

export const PROFIT_SPLIT = {
  title: 'Profit Split (55/45)',
  description: 'Your capital stays in your MT account. Profits are split: 55% yours, 45% JMJ.',
  yourShare: '55%',
  jmjFee: '45%',
  note: 'Up to 40% refund if account reaches 30% drawdown.',
} as const;

export type PayoutAccountType = 'bank' | 'crypto';

export type PayoutAccount = {
  id: string;
  title: string;
  subtitle: string;
  type: PayoutAccountType;
  badge?: string;
  isDefault?: boolean;
};

export const PAYOUT_ACCOUNTS: PayoutAccount[] = [
  {
    id: 'access-bank',
    title: 'Access Bank ****4521',
    subtitle: 'Naira Payout',
    type: 'bank',
    badge: 'DEFAULT',
    isDefault: true,
  },
  {
    id: 'usdt-wallet',
    title: 'TRC20 · 0x4f2...a8c1',
    subtitle: 'USDT Wallet',
    type: 'crypto',
    badge: 'CRYPTO',
  },
];

export const DEPOSIT_PRESETS = [2000, 2500, 5000, 10000] as const;
export const MIN_DEPOSIT = 2000;
export const DEFAULT_DEPOSIT = 5000;
export const PROFIT_TARGET_RATE = 1.5; // 150%
export const USER_PROFIT_SHARE = 0.55; // 55%
export const SERVICE_CHARGE_RATE = 0.025; // 2.5%

export function formatUsd(amount: number, fractionDigits = 2) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
}

export function formatUsdParts(amount: number) {
  const formatted = formatUsd(amount);
  const [whole, cents = '00'] = formatted.split('.');
  return { whole, cents: `.${cents}` };
}

export function getDepositProjection(deposit: number) {
  const projectedProfit = deposit * PROFIT_TARGET_RATE;
  const equityAtMaturity = deposit + projectedProfit;
  const yourShare = projectedProfit * USER_PROFIT_SHARE;
  const takeHome = deposit + yourShare;
  const serviceCharge = deposit * SERVICE_CHARGE_RATE;
  const totalToPay = deposit + serviceCharge;

  return {
    deposit,
    projectedProfit,
    equityAtMaturity,
    yourShare,
    takeHome,
    serviceCharge,
    totalToPay,
  };
}

export type PaymentMethodId = 'bank' | 'btc' | 'eth';

export type PaymentDetailRow = {
  label: string;
  value: string;
  copyable?: boolean;
};

export type PaymentMethodOption = {
  id: PaymentMethodId;
  label: string;
  detailsTitle: string;
  rows: PaymentDetailRow[];
};

export const PAYMENT_REFERENCE = 'JMJ-INV-4821';

export function getPaymentMethods(serviceChargeUsd: number): PaymentMethodOption[] {
  const amountUsd = formatUsd(serviceChargeUsd);

  return [
    {
      id: 'bank',
      label: 'Bank Transfer',
      detailsTitle: 'Transfer Details',
      rows: [
        { label: 'Bank Name', value: 'First National Bank' },
        { label: 'Account Name', value: 'JMJ Holdings Ltd' },
        { label: 'Account Number', value: '0123456789', copyable: true },
        { label: 'Amount', value: amountUsd, copyable: true },
        { label: 'Reference', value: PAYMENT_REFERENCE, copyable: true },
      ],
    },
    {
      id: 'btc',
      label: 'BTC',
      detailsTitle: 'Bitcoin Payment Details',
      rows: [
        { label: 'Network', value: 'Bitcoin (BTC)' },
        {
          label: 'Wallet Address',
          value: 'bc1qxy2kgdygjrsqtzq2n0...',
          copyable: true,
        },
        { label: 'Amount (BTC)', value: '0.00417 BTC', copyable: true },
        { label: 'Amount (USD)', value: amountUsd },
        { label: 'Reference', value: PAYMENT_REFERENCE, copyable: true },
      ],
    },
    {
      id: 'eth',
      label: 'ETH',
      detailsTitle: 'Ethereum Payment Details',
      rows: [
        { label: 'Network', value: 'Ethereum (ETH)' },
        {
          label: 'Wallet Address',
          value: '0x71C7656EC7ab88b0...',
          copyable: true,
        },
        { label: 'Amount (ETH)', value: '0.0625 ETH', copyable: true },
        { label: 'Amount (USD)', value: amountUsd },
        { label: 'Reference', value: PAYMENT_REFERENCE, copyable: true },
      ],
    },
  ];
}
