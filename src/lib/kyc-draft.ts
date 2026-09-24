import type { KycDocumentSlot } from '@/lib/api/types';

export type KycDraftDocument = {
  slot: KycDocumentSlot;
  fileUrl: string;
  fileName: string;
  mimeType: string;
  sizeBytes?: number;
  localUri?: string;
};

type KycDraft = {
  identityDocumentType: string | null;
  addressDocumentType: string | null;
  documents: Partial<Record<KycDocumentSlot, KycDraftDocument>>;
};

let draft: KycDraft = {
  identityDocumentType: null,
  addressDocumentType: null,
  documents: {},
};

export function getKycDraft() {
  return draft;
}

export function resetKycDraft() {
  draft = {
    identityDocumentType: null,
    addressDocumentType: null,
    documents: {},
  };
}

export function setKycIdentityType(id: string) {
  draft = { ...draft, identityDocumentType: id };
}

export function setKycAddressType(id: string) {
  draft = { ...draft, addressDocumentType: id };
}

export function setKycDocument(doc: KycDraftDocument) {
  draft = {
    ...draft,
    documents: {
      ...draft.documents,
      [doc.slot]: doc,
    },
  };
}

export function clearKycDocument(slot: KycDocumentSlot) {
  const next = { ...draft.documents };
  delete next[slot];
  draft = { ...draft, documents: next };
}

export function isKycDraftReadyToSubmit() {
  return Boolean(
    draft.identityDocumentType &&
      draft.addressDocumentType &&
      draft.documents.ID_FRONT &&
      draft.documents.ID_BACK &&
      draft.documents.SELFIE &&
      draft.documents.ADDRESS,
  );
}
