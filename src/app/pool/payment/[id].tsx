import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BankTransferIcon,
  BitcoinIcon,
  CopyIcon,
  EthereumIcon,
  UploadIcon,
} from '@/components/invest/invest-flow-icons';
import { Button } from '@/components/ui/button';
import {
  getPaymentMethods,
  type PaymentInstructions,
  type PaymentMethodId,
} from '@/constants/invest-flow-data';
import {
  getPoolJoinProjection,
  parsePoolSize,
  type PoolItem,
} from '@/constants/pool-data';
import type { PaymentMethodApi, PoolItemApi } from '@/lib/api/types';
import { cn } from '@/lib/cn';
import { alertError, alertSuccess } from '@/lib/errors';
import { fetchPool, fetchPoolOptions, joinPool } from '@/lib/pool';
import {
  getPoolDraft,
  setPoolPaymentMethod,
  setPoolPaymentProof,
  setPoolSubmitResult,
} from '@/lib/pool-draft';
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

function mapPool(pool: PoolItemApi): PoolItem {
  return {
    id: pool.id,
    name: pool.name,
    status: pool.status,
    shortDescription: pool.shortDescription,
    about: pool.about,
    duration: pool.duration,
    minContribution: pool.minContribution,
    minContributionValue: pool.minContributionValue,
    contributorsLabel: pool.contributorsLabel,
    contributorsJoined: pool.contributorsJoined,
    contributorsNeeded: pool.contributorsNeeded,
    raisedLabel: pool.raisedLabel,
    raisedProgress: pool.raisedProgress,
    joinProgress: pool.joinProgress,
    poolSize: pool.poolSize,
    returns: pool.returns,
    opensIn: pool.opensIn,
    targetLabel: pool.targetLabel,
    returnLabel: pool.returnLabel,
    yourEarnings: pool.yourEarnings,
    position: pool.position,
    gains: pool.gains,
    ctaLabel: pool.ctaLabel,
  };
}

export default function PoolPaymentScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const draft = getPoolDraft();
  const [methodId, setMethodId] = useState<PaymentMethodId>(
    API_TO_METHOD[draft.paymentMethod] ?? 'eth',
  );
  const [accepted, setAccepted] = useState(false);
  const [attachmentName, setAttachmentName] = useState<string | null>(
    draft.paymentProofName,
  );
  const [proofUrl, setProofUrl] = useState<string | null>(draft.paymentProofUrl);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [pool, setPool] = useState<PoolItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [instructions, setInstructions] = useState<PaymentInstructions | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    void (async () => {
      if (!id) return;
      try {
        const result = await fetchPool(id);
        setPool(mapPool(result));
        const options = await fetchPoolOptions();
        setInstructions(options.paymentInstructions);
      } catch (error) {
        alertError(error, 'Could not load payment details');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const projection = useMemo(() => {
    if (!pool) return null;
    return getPoolJoinProjection(pool.minContributionValue, parsePoolSize(pool.poolSize));
  }, [pool]);

  const methods = useMemo(
    () =>
      getPaymentMethods(projection?.serviceCharge ?? 0, {
        reference: 'Will be issued on submit',
        instructions,
      }),
    [projection?.serviceCharge, instructions],
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#C4A015" />
      </View>
    );
  }

  if (!pool || !projection) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-5">
        <Text className="font-geist-bold text-base text-stone-title">Pool not found</Text>
        <Pressable className="mt-4" onPress={() => router.back()}>
          <Text className="font-geist-medium text-muted">Go back</Text>
        </Pressable>
      </View>
    );
  }

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
      setPoolPaymentProof({
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
    if (submitting || !pool) return;
    setSubmitting(true);
    const paymentMethod = METHOD_TO_API[methodId];
    setPoolPaymentMethod(paymentMethod);

    try {
      const result = await joinPool(pool.id, {
        paymentMethod,
        paymentProofUrl: proofUrl ?? undefined,
        contributionUsd: pool.minContributionValue,
      });
      setPoolSubmitResult({
        paymentReference: result.paymentReference,
        serviceCharge: result.serviceCharge,
      });
      alertSuccess(result.message);
      router.push(`/pool/status/${pool.id}` as Href);
    } catch (error) {
      alertError(error, 'Could not submit pool contribution');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View className="flex-1 bg-white">
      <View className="px-5" style={{ paddingTop: insets.top + 8 }}>
        <View className="mb-4 flex-row items-center">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-[#F3F4F6]">
            <SymbolView name="chevron.left" size={20} tintColor="#1C1917" weight="medium" />
          </Pressable>
          <Text className="flex-1 text-center font-geist-bold text-[18px] text-stone-title">
            Payment
          </Text>
          <View className="h-11 w-11" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-5 pb-6 pt-4"
        showsVerticalScrollIndicator={false}>
        <View className="gap-3">
          <Text className="font-geist-bold text-[24px] leading-[30px] text-stone-title">
            Select Payment Method
          </Text>

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
                    'min-w-0 flex-1 flex-row items-center justify-center gap-2 rounded-[14px] border px-3 py-3',
                    selectedMethod ? 'border-[#E8C84A] bg-[#FBF6E4]' : 'border-[#E5E7EB] bg-white',
                  )}
                  style={({ pressed }) => [pressed && { opacity: 0.9 }]}>
                  <Icon color={iconColor} size={18} />
                  <Text
                    className={cn(
                      'text-center font-geist-medium text-[11px]',
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
            <Text className="font-geist-medium text-[15px] text-[#C4A015]">
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

      <View className="gap-4 px-5" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: accepted }}
          onPress={() => setAccepted((current) => !current)}
          className="flex-row items-start gap-3"
          hitSlop={4}>
          <View
            className={cn(
              'mt-0.5 h-5 w-5 items-center justify-center rounded-[5px] border',
              accepted ? 'border-[#8A6D10] bg-[#8A6D10]' : 'border-[#D1D5DB] bg-white',
            )}>
            {accepted ? <Text className="font-geist-bold text-[11px] text-white">✓</Text> : null}
          </View>
          <Text className="flex-1 font-geist text-[14px] leading-[20px] text-stone-title">
            I have read and accept the <Text className="underline">Privacy Policy</Text> and{' '}
            <Text className="underline">Terms and Conditions</Text>
          </Text>
        </Pressable>

        <Button
          disabled={!accepted || submitting}
          label={submitting ? 'Submitting…' : 'Submit'}
          onPress={() => void handleSubmit()}
        />
      </View>
    </View>
  );
}
