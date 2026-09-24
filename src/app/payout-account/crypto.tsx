import { router, type Href } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { PayoutFlowShell } from '@/components/payout/payout-flow-shell';
import { PayoutSelectField, PayoutTextField } from '@/components/payout/payout-form-fields';
import { PayoutInfoCallout } from '@/components/payout/payout-info-callout';
import { SelectOptionPicker } from '@/components/payout/select-option-picker';
import {
  CRYPTO_ASSETS,
  maskWalletAddress,
  type SelectOption,
} from '@/constants/payout-account-data';
import { alertError, alertSuccess } from '@/lib/errors';
import { fetchPayoutOptions, saveCryptoPayoutAccount } from '@/lib/payout';

export default function AddCryptoWalletScreen() {
  const [assets, setAssets] = useState<SelectOption[]>(CRYPTO_ASSETS);
  const [assetId, setAssetId] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const options = await fetchPayoutOptions();
        if (options.cryptoAssets?.length) {
          setAssets(options.cryptoAssets);
        }
      } catch {
        // Keep local catalog fallback.
      }
    })();
  }, []);

  const selectedAsset = useMemo(
    () => assets.find((asset) => asset.id === assetId) ?? null,
    [assetId, assets],
  );

  const canSave = Boolean(selectedAsset && walletAddress.trim().length >= 10);

  async function handleSave() {
    if (!canSave || !selectedAsset || loading) return;

    setLoading(true);
    try {
      const result = await saveCryptoPayoutAccount({
        assetId: selectedAsset.id,
        walletAddress,
      });
      alertSuccess('Crypto wallet linked for payouts.', 'Saved');
      router.push(
        `/payout-account/success?type=crypto&assetLabel=${encodeURIComponent(result.crypto.assetLabel ?? selectedAsset.label)}&addressMasked=${encodeURIComponent(result.crypto.addressMasked ?? maskWalletAddress(walletAddress))}` as Href,
      );
    } catch (error) {
      alertError(error, 'Could not save crypto wallet');
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(option: SelectOption) {
    setAssetId(option.id);
  }

  return (
    <>
      <PayoutFlowShell
        title="Add Crypto Wallet"
        submitLabel="Save Crypto Wallet"
        submitDisabled={!canSave}
        loading={loading}
        onSubmit={handleSave}>
        <View className="gap-3">
          <Text className="font-geist-bold text-[24px] leading-[30px] text-stone-title">
            Choose Crypto Asset
          </Text>
          <Text className="font-geist text-[14px] leading-[20px] text-stone-body">
            Select the asset you want to receive payouts in, then add your wallet address and
            optional label.
          </Text>
        </View>

        <View className="gap-4">
          <PayoutSelectField
            label="SELECT CRYPTO ASSET"
            value={selectedAsset?.label ?? null}
            placeholder="USDT (TRC20)"
            onPress={() => setPickerOpen(true)}
          />

          <PayoutTextField
            label="WALLET ADDRESS"
            value={walletAddress}
            placeholder="TY16Yv3RkaK2hZ6p1S13h7b5a599e33b952f"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setWalletAddress}
          />
        </View>

        <PayoutInfoCallout
          tone="blue"
          message="Please double-check your network type and wallet address. Transfers sent to incorrect addresses cannot be refunded."
        />
      </PayoutFlowShell>

      <SelectOptionPicker
        visible={pickerOpen}
        title="Select Crypto Asset"
        options={assets}
        selectedId={assetId}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelect}
      />
    </>
  );
}
