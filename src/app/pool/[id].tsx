import { router, useLocalSearchParams, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, ScrollView, Share, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WhatsAppIcon } from '@/components/invest/invest-flow-icons';
import { CheckmarkBadgeIcon } from '@/components/pool/pool-icons';
import { Button } from '@/components/ui/button';
import { type PoolItem, type PoolStatus } from '@/constants/pool-data';
import type { PoolItemApi } from '@/lib/api/types';
import { cn } from '@/lib/cn';
import { alertError } from '@/lib/errors';
import { fetchPool } from '@/lib/pool';
import { resetPoolDraft, setPoolDraftPool } from '@/lib/pool-draft';

function mapPool(pool: PoolItemApi): PoolItem {
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

const STATUS_STYLES: Record<PoolStatus, { label: string; badge: string; text: string }> = {
  active: {
    label: 'Active',
    badge: 'bg-[#DCFCE7]',
    text: 'text-[#166534]',
  },
  upcoming: {
    label: 'Upcoming',
    badge: 'bg-[#F5E8B0]',
    text: 'text-[#8A6D10]',
  },
  completed: {
    label: 'Completed',
    badge: 'bg-[#F3F4F6]',
    text: 'text-[#57534E]',
  },
};

export default function PoolDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pool, setPool] = useState<PoolItem | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const result = await fetchPool(id);
      setPool(mapPool(result));
    } catch (error) {
      alertError(error, 'Could not load pool');
      setPool(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-5">
        <ActivityIndicator color="#C4A015" />
      </View>
    );
  }

  if (!pool) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-5">
        <Text className="font-geist-bold text-base text-stone-title">Pool not found</Text>
        <Pressable className="mt-4" onPress={() => router.back()}>
          <Text className="font-geist-medium text-muted">Go back</Text>
        </Pressable>
      </View>
    );
  }

  const hasPosition = Boolean(pool.position);
  const isCompleted = pool.status === 'completed' && hasPosition;

  return (
    <View className="flex-1 bg-white">
      <View className="px-5" style={{ paddingTop: insets.top + 8 }}>
        <View className="mb-4 flex-row items-center">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-[#F3F4F6]">
            <SymbolView name="chevron.left" size={20} tintColor="#1C1917" weight="medium" />
          </Pressable>

          {isCompleted ? (
            <>
              <Text
                className="flex-1 text-center font-geist-bold text-[18px] text-stone-title"
                numberOfLines={1}>
                {pool.name}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Share pool"
                onPress={() => {
                  void Share.share({
                    message: `${pool.name} — ${pool.returnLabel ?? pool.returns} return`,
                  });
                }}
                className="h-11 w-11 items-center justify-center rounded-full bg-[#F3F4F6]">
                <SymbolView name="square.and.arrow.up" size={18} tintColor="#1C1917" weight="medium" />
              </Pressable>
            </>
          ) : !hasPosition ? (
            <>
              <Text className="flex-1 text-center font-geist-bold text-[18px] text-stone-title">
                Pool Detail
              </Text>
              <View className="h-11 w-11" />
            </>
          ) : (
            <View className="flex-1" />
          )}
        </View>
      </View>

      {isCompleted && pool.position ? (
        <CompletedPoolDetail pool={pool} bottomInset={insets.bottom} />
      ) : hasPosition && pool.position ? (
        <ActiveMemberPoolDetail pool={pool} bottomInset={insets.bottom} />
      ) : (
        <JoinablePoolDetail pool={pool} bottomInset={insets.bottom} />
      )}
    </View>
  );
}

function CompletedPoolDetail({ pool, bottomInset }: { pool: PoolItem; bottomInset: number }) {
  const status = STATUS_STYLES.completed;
  const position = pool.position!;

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="gap-6 px-5"
      contentContainerStyle={{ paddingBottom: Math.max(bottomInset, 24) + 8 }}
      showsVerticalScrollIndicator={false}>
      <View className="gap-3">
        <View className={cn('self-start rounded-full px-2.5 py-1', status.badge)}>
          <Text className={cn('font-geist-medium text-[12px]', status.text)}>{status.label}</Text>
        </View>
        <Text className="font-geist text-[15px] leading-[22px] text-stone-body">
          {pool.shortDescription}
        </Text>
      </View>

      <View className="rounded-[20px] bg-[#E8F8F0] p-4">
        <View className="flex-row items-center justify-between">
          <Text className="font-geist-bold text-[16px] text-[#C4A015]">{pool.raisedLabel}</Text>
          <Text className="font-geist-bold text-[16px] text-[#166534]">{pool.raisedProgress}%</Text>
        </View>
        <View className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#B7E4C7]">
          <View
            className="h-full rounded-full bg-[#166534]"
            style={{ width: `${Math.min(Math.max(pool.raisedProgress, 0), 100)}%` }}
          />
        </View>
        <View className="mt-3 flex-row items-center justify-between gap-3">
          <Text className="font-geist text-[13px] text-muted">Pool Target: {position.poolTarget}</Text>
          {position.completedOn ? (
            <Text className="font-geist-semibold text-[13px] text-[#166534]">
              Completed on {position.completedOn}
            </Text>
          ) : null}
        </View>
      </View>

      <View className="gap-3">
        <Text className="font-geist-bold text-[16px] text-stone-title">Your Final Position</Text>
        <View className="overflow-hidden rounded-[20px] border border-[#EFEFEF] bg-white">
          <View className="flex-row border-b border-[#F3F4F6]">
            <View className="flex-1 border-r border-[#F3F4F6] p-4">
              <MetricCell label="Contributed" value={position.contributed} />
            </View>
            <View className="flex-1 p-4">
              <MetricCell label="Final Value" value={position.currentValue} />
            </View>
          </View>
          <View className="flex-row">
            <View className="flex-1 border-r border-[#F3F4F6] p-4">
              <MetricCell
                label="Total Earnings"
                value={position.earnings}
                valueClassName="text-success"
              />
            </View>
            <View className="flex-1 p-4">
              <MetricCell
                label="Total Return"
                value={position.returnPercent}
                valueClassName="text-success"
              />
            </View>
          </View>
        </View>
      </View>

      <View className="gap-3">
        <Text className="font-geist-bold text-[16px] text-stone-title">Pool Summary</Text>
        <View className="overflow-hidden rounded-[20px] border border-[#EFEFEF] bg-white">
          <DetailRow label="Total Pool Size" value={pool.poolSize} />
          <DetailRow label="Total Participants" value={position.totalParticipants} />
          <DetailRow label="Duration" value={pool.duration} />
          <DetailRow label="Start Date" value={position.startDate} />
          <DetailRow label="End Date" value={position.endDate} />
          <DetailRow label="Profit Split" value={position.profitSplit} />
          <DetailRow label="Final Pool Return" value={position.poolCurrentReturn} />
          <DetailRow label="Total Pool Earnings" value={position.poolEarnings} isLast />
        </View>
      </View>
    </ScrollView>
  );
}

function ActiveMemberPoolDetail({ pool, bottomInset }: { pool: PoolItem; bottomInset: number }) {
  const status = STATUS_STYLES[pool.status];
  const position = pool.position!;

  return (
    <>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-5 pb-6"
        showsVerticalScrollIndicator={false}>
        <View className="gap-3">
          <Text className="font-geist-bold text-[28px] leading-[34px] text-stone-title">
            {pool.name}
          </Text>
          <View className={cn('self-start rounded-full px-2.5 py-1', status.badge)}>
            <Text className={cn('font-geist-medium text-[12px]', status.text)}>{status.label}</Text>
          </View>
          <Text className="font-geist text-[15px] leading-[22px] text-stone-body">
            {pool.shortDescription}
          </Text>
        </View>

        <View className="rounded-[20px] bg-[#F8F1E3] p-4">
          <View className="flex-row items-center justify-between">
            <Text className="font-geist-bold text-[16px] text-[#C4A015]">{pool.raisedLabel}</Text>
            <Text className="font-geist-bold text-[16px] text-stone-title">{pool.raisedProgress}%</Text>
          </View>
          <View className="mt-3 h-2 overflow-hidden rounded-full bg-[#E8D9A8]">
            <View
              className="h-full rounded-full bg-[#C4A015]"
              style={{ width: `${Math.min(Math.max(pool.raisedProgress, 0), 100)}%` }}
            />
          </View>
          <Text className="mt-3 font-geist text-[13px] text-muted">
            Pool Target: {position.poolTarget}
          </Text>
        </View>

        <View className="gap-3">
          <Text className="font-geist-bold text-[16px] text-stone-title">Your Position</Text>
          <View className="rounded-[20px] border border-[#EFEFEF] bg-white p-4">
            <View className="flex-row">
              <MetricCell className="flex-1" label="Contributed" value={position.contributed} />
              <MetricCell className="flex-1" label="Current Value" value={position.currentValue} />
            </View>
            <View className="my-4 h-px bg-[#F3F4F6]" />
            <View className="flex-row">
              <MetricCell
                className="flex-1"
                label="Your Earnings"
                value={position.earnings}
                valueClassName="text-success"
              />
              <MetricCell
                className="flex-1"
                label="Your Return"
                value={position.returnPercent}
                valueClassName="text-success"
              />
            </View>
          </View>
        </View>

        <View className="rounded-[20px] border border-[#EFEFEF] bg-white p-4">
          <Text className="font-geist-bold text-[14px] text-stone-title">
            Current Pool Performance
          </Text>
          <View className="mt-4 flex-row">
            <MetricCell
              className="flex-1"
              label="Current Return"
              value={position.poolCurrentReturn}
              valueClassName="text-success"
            />
            <MetricCell
              className="flex-1"
              label="Pool Earnings"
              value={position.poolEarnings}
              valueClassName="text-success"
            />
          </View>
        </View>

        <View className="gap-3">
          <Text className="font-geist-bold text-[16px] text-stone-title">Pool Details</Text>
          <View className="overflow-hidden rounded-[20px] border border-[#EFEFEF] bg-white">
            <DetailRow label="Total Pool Size" value={pool.poolSize} />
            <DetailRow label="Total Participants" value={position.totalParticipants} />
            <DetailRow label="Duration" value={pool.duration} />
            <DetailRow label="Start Date" value={position.startDate} />
            <DetailRow label="End Date" value={position.endDate} />
            <DetailRow label="Profit Split" value={position.profitSplit} isLast />
          </View>
        </View>
      </ScrollView>

      <View className="px-5" style={{ paddingBottom: Math.max(bottomInset, 24) }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Follow up on WhatsApp"
          onPress={() => Linking.openURL('https://wa.me/')}
          className="flex-row items-center justify-center gap-2 rounded-[14px] border border-[#B7E4C7] bg-[#E8F8F0] py-[16px]"
          style={({ pressed }) => [pressed && { opacity: 0.9 }]}>
          <WhatsAppIcon />
          <Text className="font-geist-semibold text-[16px] text-[#128C7E]">
            Follow up on WhatsApp
          </Text>
        </Pressable>
      </View>
    </>
  );
}

function JoinablePoolDetail({ pool, bottomInset }: { pool: PoolItem; bottomInset: number }) {
  const status = STATUS_STYLES[pool.status];
  const isJoinable = pool.status === 'active';

  return (
    <>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-5 pb-6"
        showsVerticalScrollIndicator={false}>
        <View className="gap-3">
          <View className={cn('self-start rounded-full px-2.5 py-1', status.badge)}>
            <Text className={cn('font-geist-medium text-[12px]', status.text)}>{status.label}</Text>
          </View>
          <Text className="font-geist-bold text-[28px] leading-[34px] text-stone-title">
            {pool.name}
          </Text>
        </View>

        <View className="gap-2">
          <Text className="font-geist-semibold text-[12px] tracking-wide text-muted">
            ABOUT THIS POOL
          </Text>
          <Text className="font-geist text-[15px] leading-[22px] text-stone-body">{pool.about}</Text>
        </View>

        <View className="rounded-[20px] bg-[#F8F1E3] p-4">
          <View className="flex-row">
            <StatCell label="Pool Size" value={pool.poolSize} />
            <StatCell
              label="Investors Joined"
              value={`${pool.contributorsJoined} of ${pool.contributorsNeeded}`}
            />
            <StatCell label="Duration" value={pool.duration} />
          </View>
          <View className="mt-4 flex-row">
            <StatCell label="Contribution" value={pool.minContribution} />
            <StatCell label="Investors Needed" value={`${pool.contributorsNeeded}`} />
            <StatCell label="Returns" value={pool.returns} valueClassName="text-[#C4A015]" />
          </View>
        </View>

        <View className="gap-2">
          <View className="h-1.5 overflow-hidden rounded-full bg-[#E5E7EB]">
            <View
              className="h-full rounded-full bg-[#C4A015]"
              style={{ width: `${Math.min(Math.max(pool.joinProgress, 0), 100)}%` }}
            />
          </View>
          <Text className="font-geist text-[12px] text-muted">
            {pool.contributorsJoined} of {pool.contributorsNeeded} investors joined (
            {pool.joinProgress}%)
          </Text>
        </View>

        <View className="gap-3">
          <Text className="font-geist-semibold text-[12px] tracking-wide text-muted">
            WHAT YOU GAIN
          </Text>
          {pool.gains.map((item) => (
            <View key={item} className="flex-row items-start gap-3">
              <View className="mt-0.5">
                <CheckmarkBadgeIcon size={20} />
              </View>
              <Text className="flex-1 font-geist text-[15px] leading-[22px] text-stone-title">
                {item}
              </Text>
            </View>
          ))}
        </View>

        <Text className="font-geist text-[12px] leading-[17px] text-muted">
          Profit split: 55% contributor / 45% JMJ. 2.5% service charge applies. Past performance does
          not guarantee future results.
        </Text>
      </ScrollView>

      <View className="px-5" style={{ paddingBottom: Math.max(bottomInset, 24) }}>
        <Button
          label={pool.ctaLabel}
          onPress={() => {
            if (isJoinable) {
              resetPoolDraft();
              setPoolDraftPool(pool.id, pool.name);
              router.push(`/pool/join/${pool.id}` as Href);
            }
          }}
        />
      </View>
    </>
  );
}

function MetricCell({
  label,
  value,
  valueClassName,
  className,
}: {
  label: string;
  value: string;
  valueClassName?: string;
  className?: string;
}) {
  return (
    <View className={cn('gap-1', className)}>
      <Text className="font-geist text-[12px] text-muted">{label}</Text>
      <Text className={cn('font-geist-bold text-[18px] text-stone-title', valueClassName)}>
        {value}
      </Text>
    </View>
  );
}

function DetailRow({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <View
      className={cn(
        'flex-row items-center justify-between px-4 py-3.5',
        !isLast && 'border-b border-[#F3F4F6]',
      )}>
      <Text className="font-geist text-[14px] text-muted">{label}</Text>
      <Text className="font-geist-semibold text-[14px] text-stone-title">{value}</Text>
    </View>
  );
}

function StatCell({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <View className="flex-1 gap-1">
      <Text className="font-geist text-[11px] text-muted">{label}</Text>
      <Text className={cn('font-geist-bold text-[15px] text-stone-title', valueClassName)}>
        {value}
      </Text>
    </View>
  );
}
