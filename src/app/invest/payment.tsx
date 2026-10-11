import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { InvestFlowShell } from '@/components/invest/invest-flow-shell';
import { getDepositProjection } from '@/constants/invest-flow-data';
import { cn } from '@/lib/cn';
import { alertError, alertSuccess } from '@/lib/errors';
import { createInvestment } from '@/lib/invest';
import { getInvestDraft, setInvestSubmitResult } from '@/lib/invest-draft';
import { isHostedCheckout, openHostedCheckout, waitForWhopPayment } from '@/lib/whop-checkout';

function formatUsd(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export default function PaymentScreen() {
  const draft = getInvestDraft();
  const projection = getDepositProjection(draft.amountUsd);
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);

    try {
      const result = await createInvestment({
        amountUsd: draft.amountUsd,
        riskLevel: draft.riskLevel,
        payoutAccountId: draft.payoutAccountId ?? undefined,
        name: draft.investmentName,
      });
      setInvestSubmitResult({
        paymentReference: result.paymentReference,
        serviceCharge: result.serviceCharge,
      });

      if (isHostedCheckout(result.checkout?.mode) && result.checkout.url) {
        await openHostedCheckout(result.checkout.url);
        const status = await waitForWhopPayment(result.checkout.paymentId);
        if (status.status !== 'PAID') {
          throw new Error(
            'Payment is not confirmed yet. If you completed checkout, the investment activates once Bachs confirms it.',
          );
        }
        alertSuccess('Payment received');
      } else {
        alertSuccess(result.message);
      }

      router.push('/invest/investment-status' as Href);
    } catch (error) {
      alertError(error, 'Could not start payment');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <InvestFlowShell
      title="Payment"
      step={4}
      nextLabel={submitting ? 'Opening checkout…' : 'Pay'}
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
        <View className="gap-2">
          <Text className="font-geist-bold text-[18px] text-stone-title">Pay with Bachs</Text>
          <Text className="font-geist text-[14px] leading-[20px] text-muted">
            You will complete this payment on Bachs. The investment stays pending until the payment
            is confirmed.
          </Text>
        </View>

        <View className="gap-3 rounded-[18px] bg-[#F7F7F5] p-4">
          <Row label="Deposit" value={formatUsd(projection.deposit)} />
          <Row label="Service charge" value={formatUsd(projection.serviceCharge)} />
          <Row label="Total" value={formatUsd(projection.totalToPay)} />
        </View>
      </ScrollView>
    </InvestFlowShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <Text className="font-geist text-[13px] text-muted">{label}</Text>
      <Text className="font-geist-semibold text-[13px] text-stone-title">{value}</Text>
    </View>
  );
}
