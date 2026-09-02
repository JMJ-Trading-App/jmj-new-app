import { router, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
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
  DEFAULT_DEPOSIT,
  getDepositProjection,
  getPaymentMethods,
  type PaymentMethodId,
} from '@/constants/invest-flow-data';
import { cn } from '@/lib/cn';

const METHOD_ICONS = {
  bank: BankTransferIcon,
  btc: BitcoinIcon,
  eth: EthereumIcon,
} as const;

export default function PaymentScreen() {
  const serviceCharge = getDepositProjection(DEFAULT_DEPOSIT).serviceCharge;
  const methods = useMemo(() => getPaymentMethods(serviceCharge), [serviceCharge]);
  const [methodId, setMethodId] = useState<PaymentMethodId>('bank');
  const [accepted, setAccepted] = useState(false);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  const selected = methods.find((method) => method.id === methodId) ?? methods[0];

  function handleCopy(label: string) {
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 1500);
  }

  return (
    <InvestFlowShell
      title="Payment"
      step={4}
      nextLabel="Submit"
      nextDisabled={!accepted}
      onNext={() => router.push('/invest/investment-status' as Href)}
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
                      onPress={() => handleCopy(row.label)}>
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
            onPress={() => setAttachmentName('payment-receipt.jpg')}
            className="items-center justify-center gap-2 rounded-[18px] border border-dashed border-[#D1D5DB] px-4 py-8"
            style={({ pressed }) => [pressed && { opacity: 0.9 }]}>
            <UploadIcon />
            <Text className="font-geist-semibold text-[15px] text-[#C4A015]">
              {attachmentName ? attachmentName : 'Upload attachment'}
            </Text>
            <Text className="font-geist text-[12px] text-muted">PDF, JPG, PNG up to 5MB</Text>
          </Pressable>
        </View>
      </ScrollView>
    </InvestFlowShell>
  );
}
