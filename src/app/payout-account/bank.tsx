import { router, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { PayoutFlowShell } from '@/components/payout/payout-flow-shell';
import { PayoutSelectField, PayoutTextField } from '@/components/payout/payout-form-fields';
import { PayoutInfoCallout } from '@/components/payout/payout-info-callout';
import { SelectOptionPicker } from '@/components/payout/select-option-picker';
import {
  maskAccountNumber,
  NIGERIAN_BANKS,
  type SelectOption,
} from '@/constants/payout-account-data';

export default function AddBankAccountScreen() {
  const [bankId, setBankId] = useState<string | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedBank = useMemo(
    () => NIGERIAN_BANKS.find((bank) => bank.id === bankId) ?? null,
    [bankId],
  );

  const canSave = Boolean(selectedBank && accountNumber.trim().length >= 10);

  async function handleSave() {
    if (!canSave || !selectedBank || loading) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setLoading(false);

    router.push(
      `/payout-account/success?type=bank&bankName=${encodeURIComponent(selectedBank.label)}&accountMasked=${encodeURIComponent(maskAccountNumber(accountNumber))}&methodLabel=${encodeURIComponent('Bank Transfer (Naira)')}` as Href,
    );
  }

  function handleSelect(option: SelectOption) {
    setBankId(option.id);
  }

  return (
    <>
      <PayoutFlowShell
        title="Add Bank Account"
        submitLabel="Save Bank Account"
        submitDisabled={!canSave}
        loading={loading}
        onSubmit={handleSave}>
        <View className="gap-3">
          <Text className="font-geist-bold text-[24px] leading-[30px] text-stone-title">
            Naira Bank Details
          </Text>
          <Text className="font-geist text-[14px] leading-[20px] text-stone-body">
            Funds will be deposited in local currency to your bank account.
          </Text>
        </View>

        <View className="gap-4">
          <PayoutSelectField
            label="BANK NAME"
            value={selectedBank?.label ?? null}
            placeholder="Access Bank"
            onPress={() => setPickerOpen(true)}
          />

          <PayoutTextField
            label="ACCOUNT NUMBER"
            value={accountNumber}
            placeholder="0123456789"
            keyboardType="number-pad"
            maxLength={10}
            onChangeText={setAccountNumber}
          />
        </View>

        <PayoutInfoCallout
          tone="amber"
          message="The bank account name must match your registered name on this profile exactly to guarantee payouts."
        />
      </PayoutFlowShell>

      <SelectOptionPicker
        visible={pickerOpen}
        title="Select Bank"
        options={NIGERIAN_BANKS}
        selectedId={bankId}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelect}
      />
    </>
  );
}
