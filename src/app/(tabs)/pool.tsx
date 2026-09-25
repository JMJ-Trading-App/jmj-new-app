import { useFocusEffect } from 'expo-router';
import { router, type Href } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PoolCard } from '@/components/pool/pool-card';
import { PoolEmptyState } from '@/components/pool/pool-empty-state';
import { PoolFilterTabs } from '@/components/pool/pool-filter-tabs';
import { PoolHeader } from '@/components/pool/pool-header';
import { PoolHelpSheet } from '@/components/pool/pool-help-sheet';
import { PoolSummaryCard } from '@/components/pool/pool-summary-card';
import {
  type PoolFilter,
  type PoolItem,
  type PoolSummary,
} from '@/constants/pool-data';
import { BottomTabInset } from '@/constants/theme';
import { REFRESH_CONTROL_PROPS } from '@/constants/refresh';
import type { PoolItemApi } from '@/lib/api/types';
import { alertError } from '@/lib/errors';
import { fetchPools } from '@/lib/pool';

function toPoolItem(pool: PoolItemApi): PoolItem {
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

const EMPTY_SUMMARY: PoolSummary = {
  totalWhole: '$0',
  totalCents: '.00',
  contributed: '$0.00',
  earnings: '$0.00',
  earningsPositive: true,
};

export default function PoolScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<PoolFilter>('all');
  const [helpOpen, setHelpOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState<PoolSummary>(EMPTY_SUMMARY);
  const [pools, setPools] = useState<PoolItem[]>([]);

  const load = useCallback(async (opts?: { quiet?: boolean }) => {
    if (!opts?.quiet) setLoading(true);
    try {
      const result = await fetchPools();
      setSummary({
        totalWhole: result.summary.totalWhole,
        totalCents: result.summary.totalCents,
        contributed: result.summary.contributed,
        earnings: result.summary.earnings,
        earningsPositive: result.summary.earningsPositive,
      });
      setPools(result.pools.map(toPoolItem));
    } catch (error) {
      alertError(error, 'Could not load pools');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const filteredPools = useMemo(() => {
    if (filter === 'all') return pools;
    return pools.filter((item) => item.status === filter);
  }, [filter, pools]);

  function openPool(pool: PoolItem) {
    router.push(`/pool/${pool.id}` as Href);
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 px-5"
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: BottomTabInset + 16,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              void load({ quiet: true });
            }}
            {...REFRESH_CONTROL_PROPS}
          />
        }>
        <PoolHeader onHelpPress={() => setHelpOpen(true)} />

        <PoolSummaryCard summary={summary} />

        <PoolFilterTabs value={filter} onChange={setFilter} />

        {loading ? (
          <View className="items-center py-10">
            <ActivityIndicator color="#C4A015" />
            <Text className="mt-3 font-geist text-[14px] text-muted">Loading…</Text>
          </View>
        ) : filteredPools.length === 0 ? (
          <PoolEmptyState />
        ) : (
          <View className="gap-3">
            {filteredPools.map((pool) => (
              <PoolCard
                key={pool.id}
                pool={pool}
                onPress={openPool}
                onActionPress={openPool}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <PoolHelpSheet visible={helpOpen} onClose={() => setHelpOpen(false)} />
    </View>
  );
}
