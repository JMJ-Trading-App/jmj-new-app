import { apiRequest } from '@/lib/api/client';
import type {
  CreateInvestmentResponse,
  InvestOptionsResponse,
  InvestPortfolioResponse,
  InvestmentItemApi,
  PaymentMethodApi,
} from '@/lib/api/types';

export async function fetchInvestOptions() {
  return apiRequest<InvestOptionsResponse>('/invest/options');
}

export async function fetchInvestPortfolio() {
  return apiRequest<InvestPortfolioResponse>('/invest/portfolio', {
    auth: true,
  });
}

export async function fetchInvestment(id: string) {
  return apiRequest<InvestmentItemApi>(`/invest/investments/${id}`, {
    auth: true,
  });
}

export async function createInvestment(payload: {
  amountUsd: number;
  riskLevel: string;
  paymentMethod?: PaymentMethodApi;
  paymentProofUrl?: string;
  payoutAccountId?: string;
  name?: string;
}) {
  return apiRequest<CreateInvestmentResponse>('/invest/investments', {
    method: 'POST',
    auth: true,
    body: payload,
  });
}
