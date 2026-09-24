import { useFocusEffect } from 'expo-router';
import { router, type Href } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { InvestEmptyState } from '@/components/invest/invest-empty-state';
import { InvestFilterTabs } from '@/components/invest/invest-filter-tabs';
import { InvestHeader } from '@/components/invest/invest-header';
import { InvestmentCard } from '@/components/invest/investment-card';
import { PortfolioHelpSheet } from '@/components/invest/portfolio-help-sheet';
import { PortfolioSummaryCard } from '@/components/invest/portfolio-summary-card';
import {
  type InvestFilter,
  type InvestmentItem,
  type PortfolioSummary,
} from '@/constants/invest-data';
import { BottomTabInset } from '@/constants/theme';
import type { InvestmentItemApi } from '@/lib/api/types';
import { alertError } from '@/lib/errors';
import { resetInvestDraft } from '@/lib/invest-draft';
import { fetchInvestPortfolio } from '@/lib/invest';

function toInvestmentItem(item: InvestmentItemApi): InvestmentItem {
  return {
    id: item.id,
    name: item.name,
    status: item.status,
    invested: item.invested,
    value: item.value,
    valueLabel: item.valueLabel,
    totalReturn: item.totalReturn,
    totalReturnPercent: item.totalReturnPercent,
    returnPositive: item.returnPositive,
    duration: item.duration,
    started: item.started,
    progress: item.progress,
  };
}

const EMPTY_PORTFOLIO: PortfolioSummary = {
  totalValueWhole: '$0',
  totalValueCents: '.00',
  invested: '$0.00',
  returns: '$0.00',
  returnsPositive: true,
};

export default function InvestScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<InvestFilter>('all');
  const [helpOpen, setHelpOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState<PortfolioSummary>(EMPTY_PORTFOLIO);
  const [investments, setInvestments] = useState<InvestmentItem[]>([]);

  const load = useCallback(async () => {
    try {
      const result = await fetchInvestPortfolio();
      setPortfolio({
        totalValueWhole: result.portfolio.totalValueWhole,
        totalValueCents: result.portfolio.totalValueCents,
        invested: result.portfolio.invested,
        returns: result.portfolio.returns,
        returnsPositive: result.portfolio.returnsPositive,
      });
      setInvestments(result.investments.map(toInvestmentItem));
    } catch (error) {
      alertError(error, 'Could not load investments');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const filteredInvestments = useMemo(() => {
    if (filter === 'all') return investments;
    return investments.filter((item) => item.status === filter);
  }, [filter, investments]);

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
          portfolio={portfolio}
          onStartInvesting={() => {
            resetInvestDraft();
            router.push('/invest/risk-terms' as Href);
          }}
        />

        <InvestFilterTabs value={filter} onChange={setFilter} />

        {loading ? (
          <View className="items-center py-10">
            <ActivityIndicator color="#C4A015" />
            <Text className="mt-3 font-geist text-[14px] text-muted">Loading…</Text>
          </View>
        ) : filteredInvestments.length === 0 ? (
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
