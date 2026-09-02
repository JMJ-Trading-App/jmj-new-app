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
