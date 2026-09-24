import type { PaymentMethodApi } from '@/lib/api/types';

type PoolDraft = {
  poolId: string | null;
  paymentMethod: PaymentMethodApi;
  paymentProofUrl: string | null;
  paymentProofName: string | null;
  paymentReference: string | null;
  serviceCharge: string | null;
  poolName: string | null;
};

let draft: PoolDraft = {
  poolId: null,
  paymentMethod: 'ETH',
  paymentProofUrl: null,
  paymentProofName: null,
  paymentReference: null,
  serviceCharge: null,
  poolName: null,
};

export function getPoolDraft() {
  return draft;
}

export function resetPoolDraft() {
  draft = {
    poolId: null,
    paymentMethod: 'ETH',
    paymentProofUrl: null,
    paymentProofName: null,
    paymentReference: null,
    serviceCharge: null,
    poolName: null,
  };
}

export function setPoolDraftPool(poolId: string, poolName: string) {
  draft = { ...draft, poolId, poolName };
}

export function setPoolPaymentMethod(paymentMethod: PaymentMethodApi) {
  draft = { ...draft, paymentMethod };
}

export function setPoolPaymentProof(proof: {
  fileUrl: string;
  fileName: string;
} | null) {
  draft = {
    ...draft,
    paymentProofUrl: proof?.fileUrl ?? null,
    paymentProofName: proof?.fileName ?? null,
  };
}

export function setPoolSubmitResult(result: {
  paymentReference: string;
  serviceCharge: string;
}) {
  draft = {
    ...draft,
    paymentReference: result.paymentReference,
    serviceCharge: result.serviceCharge,
  };
}
