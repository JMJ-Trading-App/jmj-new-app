import { router, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import {
  AddressFileUpload,
  type AddressFileValue,
} from '@/components/kyc/address-file-upload';
import { DocumentTypePicker } from '@/components/kyc/document-type-picker';
import { KycFlowShell } from '@/components/kyc/kyc-flow-shell';
import { KYC_ADDRESS_DOCUMENT_TYPES, type KycDocumentType } from '@/constants/kyc-data';
import { KycFlowGateLoading, useKycFlowGate } from '@/hooks/use-kyc-flow-gate';
import { cn } from '@/lib/cn';
import { alertError, alertSuccess } from '@/lib/errors';
import {
  getKycDraft,
  isKycDraftReadyToSubmit,
  resetKycDraft,
  setKycAddressType,
} from '@/lib/kyc-draft';
import { submitKyc } from '@/lib/kyc';

export default function KycProofOfAddressScreen() {
  const gated = useKycFlowGate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [file, setFile] = useState<AddressFileValue | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selected = useMemo(
    () => KYC_ADDRESS_DOCUMENT_TYPES.find((item) => item.id === selectedId) ?? null,
    [selectedId],
  );

  const canSubmit = Boolean(selected && file);

  if (gated) return <KycFlowGateLoading />;

  async function handleSubmit() {
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    try {
      const draft = getKycDraft();
      if (!isKycDraftReadyToSubmit()) {
        throw new Error(
          'Please complete ID, selfie, and address uploads before submitting.',
        );
      }

      const documents = [
        draft.documents.ID_FRONT!,
        draft.documents.ID_BACK!,
        draft.documents.SELFIE!,
        draft.documents.ADDRESS!,
      ].map((doc) => ({
        slot: doc.slot,
        fileUrl: doc.fileUrl,
        fileName: doc.fileName,
        mimeType: doc.mimeType,
        sizeBytes: doc.sizeBytes,
      }));

      await submitKyc({
        identityDocumentType: draft.identityDocumentType!,
        addressDocumentType: draft.addressDocumentType!,
        documents,
      });

      resetKycDraft();
      alertSuccess('We will notify you once review is complete.', 'KYC submitted');
      router.replace('/kyc/submitted' as Href);
    } catch (error) {
      alertError(error, 'KYC submission failed');
    } finally {
      setSubmitting(false);
    }
  }

  function handleSelect(option: KycDocumentType) {
    setSelectedId(option.id);
    setKycAddressType(option.id);
  }

  return (
    <>
      <KycFlowShell
        title="Proof of Address"
        step={3}
        nextDisabled={!canSubmit || submitting}
        nextLoading={submitting}
        nextLabel="Submit for Review"
        onNext={handleSubmit}>
        <View className="gap-6">
          <View className="gap-2">
            <Text className="font-geist-semibold text-[11px] tracking-[0.08em] text-muted">
              SELECT DOCUMENT TYPE
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Select document type"
              onPress={() => setPickerOpen(true)}
              className={cn(
                'flex-row items-center justify-between rounded-[14px] border bg-white px-4 py-[16px]',
                selected ? 'border-stone-title' : 'border-[#D1D5DB]',
              )}
              style={({ pressed }) => [pressed && { opacity: 0.92 }]}>
              <Text
                className={cn(
                  'font-geist text-[15px]',
                  selected ? 'text-stone-title' : 'text-[#9CA3AF]',
                )}>
                {selected?.label ?? 'Select'}
              </Text>
              <SymbolView name="chevron.down" size={16} tintColor="#9CA3AF" weight="medium" />
            </Pressable>
          </View>

          {selected ? (
            <View className="gap-3">
              <Text className="font-geist-semibold text-[11px] tracking-[0.08em] text-muted">
                UPLOAD DOCUMENT
              </Text>
              <AddressFileUpload value={file} onChange={setFile} />
            </View>
          ) : null}
        </View>
      </KycFlowShell>

      <DocumentTypePicker
        visible={pickerOpen}
        options={KYC_ADDRESS_DOCUMENT_TYPES}
        selectedId={selectedId}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelect}
      />
    </>
  );
}
