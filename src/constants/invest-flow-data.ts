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

/** Presets stay under Bachs ~$5k checkout cap after the 2.5% service charge. */
export const DEPOSIT_PRESETS = [2000, 2500, 4000, 4500] as const;
export const MIN_DEPOSIT = 2000;
export const DEFAULT_DEPOSIT = 4000;
/** Online card checkout max (deposit + fees). */
export const BACHS_MAX_CHECKOUT_USD = 5000;
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

export type PaymentInstructions = {
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

const DEFAULT_PAYMENT_INSTRUCTIONS: PaymentInstructions = {
  bank: {
    bankName: 'First National Bank',
    accountName: 'JMJ Holdings Ltd',
    accountNumber: '0123456789',
  },
  btc: {
    network: 'Bitcoin (BTC)',
    walletAddress: 'bc1qxy2kgdygjrsqtzq2n0zd5wexgrrqx023ux9p0x',
    amountBtcHint: '0.00417 BTC',
  },
  eth: {
    network: 'Ethereum (ETH)',
    walletAddress: '0x71C7656EC7ab88b098deaf765432109876543210',
    amountEthHint: '0.0625 ETH',
  },
};

export function getPaymentMethods(
  serviceChargeUsd: number,
  options?: {
    reference?: string;
    instructions?: PaymentInstructions;
  },
): PaymentMethodOption[] {
  const amountUsd = formatUsd(serviceChargeUsd);
  const reference = options?.reference ?? PAYMENT_REFERENCE;
  const instructions = options?.instructions ?? DEFAULT_PAYMENT_INSTRUCTIONS;

  return [
    {
      id: 'bank',
      label: 'Bank Transfer',
      detailsTitle: 'Transfer Details',
      rows: [
        { label: 'Bank Name', value: instructions.bank.bankName },
        { label: 'Account Name', value: instructions.bank.accountName },
        {
          label: 'Account Number',
          value: instructions.bank.accountNumber,
          copyable: true,
        },
        { label: 'Amount', value: amountUsd, copyable: true },
        { label: 'Reference', value: reference, copyable: true },
      ],
    },
    {
      id: 'btc',
      label: 'BTC',
      detailsTitle: 'Bitcoin Payment Details',
      rows: [
        { label: 'Network', value: instructions.btc.network },
        {
          label: 'Wallet Address',
          value: instructions.btc.walletAddress,
          copyable: true,
        },
        {
          label: 'Amount (BTC)',
          value: instructions.btc.amountBtcHint,
          copyable: true,
        },
        { label: 'Amount (USD)', value: amountUsd },
        { label: 'Reference', value: reference, copyable: true },
      ],
    },
    {
      id: 'eth',
      label: 'ETH',
      detailsTitle: 'Ethereum Payment Details',
      rows: [
        { label: 'Network', value: instructions.eth.network },
        {
          label: 'Wallet Address',
          value: instructions.eth.walletAddress,
          copyable: true,
        },
        {
          label: 'Amount (ETH)',
          value: instructions.eth.amountEthHint,
          copyable: true,
        },
        { label: 'Amount (USD)', value: amountUsd },
        { label: 'Reference', value: reference, copyable: true },
      ],
    },
  ];
}
