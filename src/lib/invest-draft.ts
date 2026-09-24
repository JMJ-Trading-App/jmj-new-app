import type { PaymentMethodApi } from '@/lib/api/types';
import type { RiskLevelId } from '@/constants/invest-flow-data';
import { DEFAULT_DEPOSIT } from '@/constants/invest-flow-data';

type InvestDraft = {
  riskLevel: RiskLevelId;
  payoutAccountId: string | null;
  amountUsd: number;
  paymentMethod: PaymentMethodApi;
  paymentProofUrl: string | null;
  paymentProofName: string | null;
  paymentReference: string | null;
  serviceCharge: string | null;
  investmentName: string;
};

let draft: InvestDraft = {
  riskLevel: 'moderate',
  payoutAccountId: null,
  amountUsd: DEFAULT_DEPOSIT,
  paymentMethod: 'BANK',
  paymentProofUrl: null,
  paymentProofName: null,
  paymentReference: null,
  serviceCharge: null,
  investmentName: 'Growth Fund',
};

export function getInvestDraft() {
  return draft;
}

export function resetInvestDraft() {
  draft = {
    riskLevel: 'moderate',
    payoutAccountId: null,
    amountUsd: DEFAULT_DEPOSIT,
    paymentMethod: 'BANK',
    paymentProofUrl: null,
    paymentProofName: null,
    paymentReference: null,
    serviceCharge: null,
    investmentName: 'Growth Fund',
  };
}

export function setInvestRiskLevel(riskLevel: RiskLevelId) {
  draft = { ...draft, riskLevel };
}

export function setInvestPayoutAccountId(payoutAccountId: string | null) {
  draft = { ...draft, payoutAccountId };
}

export function setInvestAmount(amountUsd: number) {
  draft = { ...draft, amountUsd };
}

export function setInvestPaymentMethod(paymentMethod: PaymentMethodApi) {
  draft = { ...draft, paymentMethod };
}

export function setInvestPaymentProof(proof: {
  fileUrl: string;
  fileName: string;
} | null) {
  draft = {
    ...draft,
    paymentProofUrl: proof?.fileUrl ?? null,
    paymentProofName: proof?.fileName ?? null,
  };
}

export function setInvestSubmitResult(result: {
  paymentReference: string;
  serviceCharge: string;
}) {
  draft = {
    ...draft,
    paymentReference: result.paymentReference,
    serviceCharge: result.serviceCharge,
  };
}
