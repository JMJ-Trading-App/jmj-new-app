import { apiRequest } from '@/lib/api/client';

export type PayoutOption = { id: string; label: string };

export type PayoutMethodOption = {
  id: 'bank' | 'crypto';
  title: string;
  subtitle: string;
  badge: string;
};

export type BankPayoutAccount = {
  id: string;
  type: 'BANK';
  bankId: string | null;
  bankName: string | null;
  accountNumber: string | null;
  accountMasked: string | null;
  accountName: string | null;
  methodLabel: string;
  isDefault: boolean;
};

export type CryptoPayoutAccount = {
  id: string;
  type: 'CRYPTO';
  assetId: string | null;
  assetLabel: string | null;
  walletAddress: string | null;
  addressMasked: string | null;
  isDefault: boolean;
};

export type PayoutAccountsResponse = {
  bank: BankPayoutAccount | null;
  crypto: CryptoPayoutAccount | null;
};

export type PayoutOptionsResponse = {
  banks: PayoutOption[];
  cryptoAssets: PayoutOption[];
  methods: PayoutMethodOption[];
};

export async function fetchPayoutOptions() {
  return apiRequest<PayoutOptionsResponse>('/payout/options');
}

export async function fetchPayoutAccounts() {
  return apiRequest<PayoutAccountsResponse>('/payout/accounts', { auth: true });
}

export async function saveBankPayoutAccount(payload: {
  bankId: string;
  accountNumber: string;
}) {
  return apiRequest<{ message: string; bank: BankPayoutAccount }>(
    '/payout/accounts/bank',
    {
      method: 'POST',
      auth: true,
      body: {
        bankId: payload.bankId,
        accountNumber: payload.accountNumber.replace(/\D/g, ''),
      },
    },
  );
}

export async function saveCryptoPayoutAccount(payload: {
  assetId: string;
  walletAddress: string;
}) {
  return apiRequest<{ message: string; crypto: CryptoPayoutAccount }>(
    '/payout/accounts/crypto',
    {
      method: 'POST',
      auth: true,
      body: {
        assetId: payload.assetId,
        walletAddress: payload.walletAddress.trim(),
      },
    },
  );
}

export async function deletePayoutAccount(id: string) {
  return apiRequest<{ message: string }>(`/payout/accounts/${id}`, {
    method: 'DELETE',
    auth: true,
  });
}
