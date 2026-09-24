import { router, type Href } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
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
import { alertError, alertSuccess } from '@/lib/errors';
import { fetchPayoutOptions, saveBankPayoutAccount } from '@/lib/payout';

export default function AddBankAccountScreen() {
  const [banks, setBanks] = useState<SelectOption[]>(NIGERIAN_BANKS);
  const [bankId, setBankId] = useState<string | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const options = await fetchPayoutOptions();
        if (options.banks?.length) {
          setBanks(options.banks);
        }
      } catch {
        // Keep local catalog fallback.
      }
    })();
  }, []);

  const selectedBank = useMemo(
    () => banks.find((bank) => bank.id === bankId) ?? null,
    [bankId, banks],
  );

  const canSave = Boolean(selectedBank && accountNumber.trim().length >= 10);

  async function handleSave() {
    if (!canSave || !selectedBank || loading) return;

    setLoading(true);
    try {
      const result = await saveBankPayoutAccount({
        bankId: selectedBank.id,
        accountNumber,
      });
      alertSuccess('Bank account linked for payouts.', 'Saved');
      router.push(
        `/payout-account/success?type=bank&bankName=${encodeURIComponent(result.bank.bankName ?? selectedBank.label)}&accountMasked=${encodeURIComponent(result.bank.accountMasked ?? maskAccountNumber(accountNumber))}&methodLabel=${encodeURIComponent(result.bank.methodLabel)}` as Href,
      );
    } catch (error) {
      alertError(error, 'Could not save bank account');
    } finally {
      setLoading(false);
    }
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
        options={banks}
        selectedId={bankId}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelect}
      />
    </>
  );
}
