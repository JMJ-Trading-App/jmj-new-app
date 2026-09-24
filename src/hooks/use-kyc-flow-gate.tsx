import { router, useFocusEffect, type Href } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useSession } from '@/hooks/use-session';
import { fetchKycStatus } from '@/lib/kyc';

/**
 * Blocks KYC upload steps when the user is already verified or in review.
 * Returns true while the gate is still checking.
 */
export function useKycFlowGate() {
  const { user, refreshUser } = useSession();
  const [blocking, setBlocking] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void (async () => {
        try {
          const [me, kyc] = await Promise.all([
            refreshUser(),
            fetchKycStatus().catch(() => null),
          ]);
          if (!active) return;
          const status = (
            kyc?.kycStatus ||
            me?.kycStatus ||
            user?.kycStatus ||
            'PENDING'
          ).toUpperCase();
          if (status === 'VERIFIED' || status === 'SUBMITTED') {
            router.replace('/kyc' as Href);
            return;
          }
        } finally {
          if (active) setBlocking(false);
        }
      })();
      return () => {
        active = false;
      };
    }, [refreshUser, user?.kycStatus]),
  );

  return blocking;
}

export function KycFlowGateLoading() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator color="#1C1917" />
    </View>
  );
}
