import { router, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PoolCard } from '@/components/pool/pool-card';
import { PoolEmptyState } from '@/components/pool/pool-empty-state';
import { PoolFilterTabs } from '@/components/pool/pool-filter-tabs';
import { PoolHeader } from '@/components/pool/pool-header';
import { PoolHelpSheet } from '@/components/pool/pool-help-sheet';
import { PoolSummaryCard } from '@/components/pool/pool-summary-card';
import { POOL_SUMMARY, POOLS, type PoolFilter, type PoolItem } from '@/constants/pool-data';
import { BottomTabInset } from '@/constants/theme';

export default function PoolScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<PoolFilter>('all');
  const [helpOpen, setHelpOpen] = useState(false);

  const filteredPools = useMemo(() => {
    if (filter === 'all') return POOLS;
    return POOLS.filter((item) => item.status === filter);
  }, [filter]);

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
        showsVerticalScrollIndicator={false}>
        <PoolHeader onHelpPress={() => setHelpOpen(true)} />

        <PoolSummaryCard summary={POOL_SUMMARY} />

        <PoolFilterTabs value={filter} onChange={setFilter} />

        {filteredPools.length === 0 ? (
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
