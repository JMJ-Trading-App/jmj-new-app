import { router, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { DocumentTypePicker } from '@/components/kyc/document-type-picker';
import {
  DocumentUploadSlot,
  type DocumentUploadValue,
} from '@/components/kyc/document-upload-slot';
import { KycFlowShell } from '@/components/kyc/kyc-flow-shell';
import { KYC_DOCUMENT_TYPES, type KycDocumentType } from '@/constants/kyc-data';
import { KycFlowGateLoading, useKycFlowGate } from '@/hooks/use-kyc-flow-gate';
import { cn } from '@/lib/cn';
import { setKycIdentityType } from '@/lib/kyc-draft';

export default function KycIdentityDocumentScreen() {
  const gated = useKycFlowGate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [frontUpload, setFrontUpload] = useState<DocumentUploadValue | null>(null);
  const [backUpload, setBackUpload] = useState<DocumentUploadValue | null>(null);

  const selected = useMemo(
    () => KYC_DOCUMENT_TYPES.find((item) => item.id === selectedId) ?? null,
    [selectedId],
  );

  const canContinue = Boolean(selected && frontUpload && backUpload);

  function handleSelect(option: KycDocumentType) {
    setSelectedId(option.id);
    setKycIdentityType(option.id);
  }

  if (gated) return <KycFlowGateLoading />;

  return (
    <>
      <KycFlowShell
        title="Identity Document"
        step={1}
        nextDisabled={!canContinue}
        onNext={() => router.push('/kyc/selfie' as Href)}>
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
                {selected?.label ?? 'Select...'}
              </Text>
              <SymbolView name="chevron.down" size={16} tintColor="#9CA3AF" weight="medium" />
            </Pressable>
          </View>

          {selected ? (
            <View className="gap-3">
              <Text className="font-geist-semibold text-[11px] tracking-[0.08em] text-muted">
                UPLOAD DOCUMENT
              </Text>

              <DocumentUploadSlot
                label="Tap to upload front of ID"
                slot="ID_FRONT"
                value={frontUpload}
                onChange={setFrontUpload}
              />

              <DocumentUploadSlot
                label="Tap to upload back of ID"
                slot="ID_BACK"
                value={backUpload}
                onChange={setBackUpload}
              />
            </View>
          ) : null}
        </View>
      </KycFlowShell>

      <DocumentTypePicker
        visible={pickerOpen}
        options={KYC_DOCUMENT_TYPES}
        selectedId={selectedId}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelect}
      />
    </>
  );
}
