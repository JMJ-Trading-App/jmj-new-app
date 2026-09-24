import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { InvestFlowShell } from '@/components/invest/invest-flow-shell';
import { ProfitSplitCard } from '@/components/invest/profit-split-card';
import { RiskLevelCard } from '@/components/invest/risk-level-card';
import { RISK_LEVELS, type RiskLevelId } from '@/constants/invest-flow-data';
import { getInvestDraft, setInvestRiskLevel } from '@/lib/invest-draft';

export default function RiskTermsScreen() {
  const [riskLevel, setRiskLevel] = useState<RiskLevelId>(
    getInvestDraft().riskLevel,
  );

  return (
    <InvestFlowShell
      title="Risk & Terms"
      step={1}
      onNext={() => {
        setInvestRiskLevel(riskLevel);
        router.push('/invest/payout-account' as Href);
      }}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-5 pb-6 pt-6"
        showsVerticalScrollIndicator={false}>
        <View className="gap-3">
          <Text className="font-geist-bold text-[24px] text-stone-title">Risk Level</Text>
          <Text className="font-geist text-[14px] leading-[20px] text-stone-body">
            Pick the level you are most comfortable with regardless of deposit size. You'll enter
            your investment amount in Step 3, along with projected returns and payment details.
          </Text>
        </View>

        <View className="gap-3">
          {RISK_LEVELS.map((option) => (
            <RiskLevelCard
              key={option.id}
              option={option}
              selected={riskLevel === option.id}
              onPress={() => setRiskLevel(option.id)}
            />
          ))}
        </View>

        <ProfitSplitCard />
      </ScrollView>
    </InvestFlowShell>
  );
}
