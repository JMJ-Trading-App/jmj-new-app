import { apiRequest, apiUpload } from '@/lib/api/client';
import type {
  KycDocumentSlot,
  KycStatusResponse,
  KycUploadResult,
  PublicUser,
} from '@/lib/api/types';
import { updateSessionUser } from '@/lib/session';

export async function fetchKycOptions() {
  return apiRequest<{
    provider: string;
    requirements: unknown[];
    identityDocumentTypes: { id: string; label: string }[];
    addressDocumentTypes: { id: string; label: string }[];
    selfieTips: string[];
  }>('/kyc/options');
}

export async function fetchKycStatus() {
  const result = await apiRequest<KycStatusResponse>('/kyc/status', {
    auth: true,
  });
  await updateSessionUser(result.user);
  return result;
}

export async function uploadKycFile(file: {
  uri: string;
  name: string;
  type: string;
}) {
  return apiUpload<KycUploadResult>('/kyc/uploads', file);
}

export async function submitKyc(payload: {
  identityDocumentType: string;
  addressDocumentType: string;
  documents: {
    slot: KycDocumentSlot;
    fileUrl: string;
    fileName?: string;
    mimeType?: string;
    sizeBytes?: number;
  }[];
}) {
  const result = await apiRequest<{
    message: string;
    provider: string;
    kycStatus: string;
    submission: unknown;
    user: PublicUser;
  }>('/kyc/submit', {
    method: 'POST',
    auth: true,
    body: payload,
  });
  await updateSessionUser(result.user);
  return result;
}
