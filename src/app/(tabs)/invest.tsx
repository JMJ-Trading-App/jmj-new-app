import { router, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { InvestEmptyState } from '@/components/invest/invest-empty-state';
import { InvestFilterTabs } from '@/components/invest/invest-filter-tabs';
import { InvestHeader } from '@/components/invest/invest-header';
import { InvestmentCard } from '@/components/invest/investment-card';
import { PortfolioHelpSheet } from '@/components/invest/portfolio-help-sheet';
import { PortfolioSummaryCard } from '@/components/invest/portfolio-summary-card';
import {
  INVEST_PORTFOLIO,
  INVESTMENTS,
  type InvestFilter,
} from '@/constants/invest-data';
import { BottomTabInset } from '@/constants/theme';

export default function InvestScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<InvestFilter>('all');
  const [helpOpen, setHelpOpen] = useState(false);

  const filteredInvestments = useMemo(() => {
    if (filter === 'all') return INVESTMENTS;
    return INVESTMENTS.filter((item) => item.status === filter);
  }, [filter]);

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
        <InvestHeader onHelpPress={() => setHelpOpen(true)} />

        <PortfolioSummaryCard
          portfolio={INVEST_PORTFOLIO}
          onStartInvesting={() => router.push('/invest/risk-terms' as Href)}
        />

        <InvestFilterTabs value={filter} onChange={setFilter} />

        {filteredInvestments.length === 0 ? (
          <InvestEmptyState />
        ) : (
          <View className="gap-3">
            {filteredInvestments.map((item) => (
              <InvestmentCard key={item.id} item={item} />
            ))}
          </View>
        )}
      </ScrollView>

      <PortfolioHelpSheet visible={helpOpen} onClose={() => setHelpOpen(false)} />
    </View>
  );
}
