import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import { router, type Href } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import {
  BankTransferIcon,
  BitcoinIcon,
  CopyIcon,
  EthereumIcon,
  UploadIcon,
} from '@/components/invest/invest-flow-icons';
import { InvestFlowShell } from '@/components/invest/invest-flow-shell';
import {
  getDepositProjection,
  getPaymentMethods,
  type PaymentInstructions,
  type PaymentMethodId,
} from '@/constants/invest-flow-data';
import type { PaymentMethodApi } from '@/lib/api/types';
import { cn } from '@/lib/cn';
import { alertError, alertSuccess } from '@/lib/errors';
import { createInvestment, fetchInvestOptions } from '@/lib/invest';
import {
  getInvestDraft,
  setInvestPaymentMethod,
  setInvestPaymentProof,
  setInvestSubmitResult,
} from '@/lib/invest-draft';
import { uploadPaymentProof } from '@/lib/payments';

const METHOD_ICONS = {
  bank: BankTransferIcon,
  btc: BitcoinIcon,
  eth: EthereumIcon,
} as const;

const METHOD_TO_API: Record<PaymentMethodId, PaymentMethodApi> = {
  bank: 'BANK',
  btc: 'BTC',
  eth: 'ETH',
};

const API_TO_METHOD: Record<PaymentMethodApi, PaymentMethodId> = {
  BANK: 'bank',
  BTC: 'btc',
  ETH: 'eth',
};

function guessMime(uri: string) {
  const lower = uri.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.pdf')) return 'application/pdf';
  return 'image/jpeg';
}

export default function PaymentScreen() {
  const draft = getInvestDraft();
  const serviceCharge = getDepositProjection(draft.amountUsd).serviceCharge;
  const [methodId, setMethodId] = useState<PaymentMethodId>(
    API_TO_METHOD[draft.paymentMethod] ?? 'bank',
  );
  const [accepted, setAccepted] = useState(false);
  const [attachmentName, setAttachmentName] = useState<string | null>(
    draft.paymentProofName,
  );
  const [proofUrl, setProofUrl] = useState<string | null>(draft.paymentProofUrl);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [instructions, setInstructions] = useState<PaymentInstructions | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    void fetchInvestOptions()
      .then((options) => setInstructions(options.paymentInstructions))
      .catch(() => undefined);
  }, []);

  const methods = useMemo(
    () =>
      getPaymentMethods(serviceCharge, {
        reference: 'Will be issued on submit',
        instructions,
      }),
    [serviceCharge, instructions],
  );

  const selected = methods.find((method) => method.id === methodId) ?? methods[0];

  async function handleCopy(label: string, value: string) {
    await Clipboard.setStringAsync(value);
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 1500);
  }

  async function handleUpload() {
    if (uploading) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alertError(new Error('Photo library permission is required.'), 'Permission needed');
      return;
    }

    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });
    if (picked.canceled || !picked.assets[0]) return;

    const asset = picked.assets[0];
    const name = asset.fileName ?? 'payment-receipt.jpg';
    const mimeType = asset.mimeType ?? guessMime(asset.uri);

    setUploading(true);
    try {
      const uploaded = await uploadPaymentProof({
        uri: asset.uri,
        name,
        type: mimeType,
      });
      setAttachmentName(uploaded.fileName || name);
      setProofUrl(uploaded.fileUrl);
      setInvestPaymentProof({
        fileUrl: uploaded.fileUrl,
        fileName: uploaded.fileName || name,
      });
      alertSuccess('Payment screenshot uploaded');
    } catch (error) {
      alertError(error, 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    const paymentMethod = METHOD_TO_API[methodId];
    setInvestPaymentMethod(paymentMethod);

    try {
      const result = await createInvestment({
        amountUsd: draft.amountUsd,
        riskLevel: draft.riskLevel,
        paymentMethod,
        paymentProofUrl: proofUrl ?? undefined,
        payoutAccountId: draft.payoutAccountId ?? undefined,
        name: draft.investmentName,
      });
      setInvestSubmitResult({
        paymentReference: result.paymentReference,
        serviceCharge: result.serviceCharge,
      });
      alertSuccess(result.message);
      router.push('/invest/investment-status' as Href);
    } catch (error) {
      alertError(error, 'Could not submit investment');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <InvestFlowShell
      title="Payment"
      step={4}
      nextLabel={submitting ? 'Submitting…' : 'Submit'}
      nextDisabled={!accepted || submitting}
      onNext={() => void handleSubmit()}
      footerExtra={
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: accepted }}
          onPress={() => setAccepted((current) => !current)}
          className="flex-row items-center gap-3"
          hitSlop={4}>
          <View
            className={cn(
              'h-5 w-5 items-center justify-center rounded-[5px] border',
              accepted ? 'border-[#C4A015] bg-[#C4A015]' : 'border-[#D1D5DB] bg-white',
            )}>
            {accepted ? <Text className="font-geist-bold text-[11px] text-white">✓</Text> : null}
          </View>
          <Text className="flex-1 font-geist text-[14px] text-stone-title">
            I have read and accept the Privacy Policy.
          </Text>
        </Pressable>
      }>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-5 pb-6 pt-6"
        showsVerticalScrollIndicator={false}>
        <View className="gap-3">
          <Text className="font-geist-bold text-[18px] text-stone-title">Select Payment Method</Text>

          <View className="flex-row gap-2">
            {methods.map((method) => {
              const selectedMethod = method.id === methodId;
              const Icon = METHOD_ICONS[method.id];
              const iconColor = selectedMethod
                ? '#C4A015'
                : method.id === 'btc'
                  ? '#F7931A'
                  : method.id === 'eth'
                    ? '#627EEA'
                    : '#78716C';

              return (
                <Pressable
                  key={method.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selectedMethod }}
                  onPress={() => setMethodId(method.id)}
                  className={cn(
                    'min-w-0 flex-1 items-center gap-1.5 rounded-[14px] border px-2 py-3',
                    selectedMethod
                      ? 'border-[#E8C84A] bg-[#FBF6E4]'
                      : 'border-[#E5E7EB] bg-white',
                  )}
                  style={({ pressed }) => [pressed && { opacity: 0.9 }]}>
                  <Icon color={iconColor} size={18} />
                  <Text
                    className={cn(
                      'text-center font-geist-semibold text-[11px]',
                      selectedMethod ? 'text-[#8A6D10]' : 'text-stone-title',
                    )}
                    numberOfLines={1}>
                    {method.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="gap-4 rounded-[18px] bg-[#F7F7F5] p-4">
          <Text className="font-geist-bold text-[16px] text-stone-title">
            {selected.detailsTitle}
          </Text>

          <View className="gap-3">
            {selected.rows.map((row) => (
              <View key={row.label} className="flex-row items-center justify-between gap-3">
                <Text className="font-geist text-[13px] text-muted">{row.label}</Text>
                <View className="max-w-[60%] flex-row items-center gap-2">
                  <Text
                    className="font-geist-semibold text-[13px] text-stone-title"
                    numberOfLines={1}>
                    {row.value}
                  </Text>
                  {row.copyable ? (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Copy ${row.label}`}
                      hitSlop={8}
                      onPress={() => void handleCopy(row.label, row.value)}>
                      <CopyIcon color={copiedLabel === row.label ? '#16A34A' : '#9CA3AF'} />
                    </Pressable>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className="gap-3">
          <Text className="font-geist-bold text-[16px] text-stone-title">
            Upload Payment Screenshot
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Upload attachment"
            disabled={uploading}
            onPress={() => void handleUpload()}
            className="items-center justify-center gap-2 rounded-[18px] border border-dashed border-[#D1D5DB] px-4 py-8"
            style={({ pressed }) => [pressed && { opacity: 0.9 }]}>
            <UploadIcon />
            <Text className="font-geist-semibold text-[15px] text-[#C4A015]">
              {uploading
                ? 'Uploading…'
                : attachmentName
                  ? attachmentName
                  : 'Upload attachment'}
            </Text>
            <Text className="font-geist text-[12px] text-muted">PDF, JPG, PNG up to 5MB</Text>
          </Pressable>
        </View>
      </ScrollView>
    </InvestFlowShell>
  );
}
