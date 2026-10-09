export type PayoutMethodId = 'bank' | 'crypto';

export type PayoutMethodOption = {
  id: PayoutMethodId;
  title: string;
  subtitle: string;
  badge: string;
};

export type SelectOption = {
  id: string;
  label: string;
};

export type LinkedBankAccount = {
  bankName: string;
  accountMasked: string;
  accountName: string;
  methodLabel: string;
};

export type LinkedCryptoWallet = {
  assetLabel: string;
  addressMasked: string;
};

export const PAYOUT_METHODS: PayoutMethodOption[] = [
  {
    id: 'bank',
    title: 'Bank Account (Naira)',
    subtitle: 'Local Bank Payouts',
    badge: 'REQUIRED',
  },
  {
    id: 'crypto',
    title: 'Crypto Wallet',
    subtitle: 'Crypto Payout',
    badge: 'OPTIONAL',
  },
];

export const NIGERIAN_BANKS: SelectOption[] = [
  { id: 'access', label: 'Access Bank' },
  { id: 'gtb', label: 'Guaranty Trust Bank' },
  { id: 'zenith', label: 'Zenith Bank' },
  { id: 'uba', label: 'United Bank for Africa' },
  { id: 'first', label: 'First Bank of Nigeria' },
  { id: 'fidelity', label: 'Fidelity Bank' },
  { id: 'fcmb', label: 'FCMB' },
  { id: 'ecobank', label: 'Ecobank Nigeria' },
  { id: 'stanbic', label: 'Stanbic IBTC Bank' },
  { id: 'sterling', label: 'Sterling Bank' },
  { id: 'union', label: 'Union Bank' },
  { id: 'wema', label: 'Wema Bank' },
  { id: 'polaris', label: 'Polaris Bank' },
  { id: 'keystone', label: 'Keystone Bank' },
  { id: 'unity', label: 'Unity Bank' },
  { id: 'providus', label: 'Providus Bank' },
  { id: 'heritage', label: 'Heritage Bank' },
  { id: 'standard-chartered', label: 'Standard Chartered' },
  { id: 'citibank', label: 'Citibank Nigeria' },
  { id: 'jaiz', label: 'Jaiz Bank' },
  { id: 'lotus', label: 'Lotus Bank' },
  { id: 'taj', label: 'TAJ Bank' },
  { id: 'suntrust', label: 'SunTrust Bank' },
  { id: 'globus', label: 'Globus Bank' },
  { id: 'premiumtrust', label: 'PremiumTrust Bank' },
  { id: 'optimus', label: 'Optimus Bank' },
  { id: 'parallex', label: 'Parallex Bank' },
  { id: 'signature', label: 'Signature Bank' },
  { id: 'kuda', label: 'Kuda Bank' },
  { id: 'opay', label: 'OPay' },
  { id: 'palmpay', label: 'PalmPay' },
  { id: 'moniepoint', label: 'Moniepoint MFB' },
  { id: 'vfd', label: 'VFD Microfinance Bank' },
  { id: 'carbon', label: 'Carbon' },
  { id: 'rubies', label: 'Rubies Bank' },
  { id: 'sparkle', label: 'Sparkle' },
  { id: 'fairmoney', label: 'FairMoney' },
];

export const CRYPTO_ASSETS: SelectOption[] = [
  { id: 'usdt-trc20', label: 'USDT (TRC20)' },
  { id: 'usdt-erc20', label: 'USDT (ERC20)' },
  { id: 'btc', label: 'Bitcoin (BTC)' },
  { id: 'eth', label: 'Ethereum (ETH)' },
];

export const CRYPTO_HUB_SUBTITLE = 'USDT Stablecoin (TRC20/ERC20)';

export const DEFAULT_LINKED_BANK: LinkedBankAccount = {
  bankName: 'Access Bank',
  accountMasked: '****4521',
  accountName: 'Ayomide',
  methodLabel: 'Bank Transfer (Naira)',
};

export function maskAccountNumber(accountNumber: string) {
  const digits = accountNumber.replace(/\D/g, '');
  const last4 = digits.slice(-4);
  return `****${last4}`;
}

export function maskWalletAddress(address: string) {
  const trimmed = address.trim();
  if (trimmed.length <= 8) return trimmed;
  return `${trimmed.slice(0, 4)}····${trimmed.slice(-4)}`;
}
