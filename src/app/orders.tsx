import { router, useFocusEffect, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { REFRESH_CONTROL_PROPS } from '@/constants/refresh';
import { apiRequest } from '@/lib/api/client';
import { alertError } from '@/lib/errors';

type OrderRow = {
  id: string;
  kind: 'investment' | 'pool' | 'subscription';
  title: string;
  status: string;
  amountUsd: number;
  reference: string | null;
  createdAt: string;
  href: string;
};

const KIND_LABEL = {
  investment: 'Investment',
  pool: 'Pool',
  subscription: 'Subscription',
} as const;

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const result = await apiRequest<{ orders: OrderRow[] }>('/users/me/orders', {
        auth: true,
      });
      setOrders(result.orders);
    } catch (error) {
      alertError(error, 'Could not load orders');
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
          <Text className="flex-1 text-center font-geist-bold text-[18px] text-stone-title">
            Orders
          </Text>
          <View className="h-11 w-11" />
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#C4A015" />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-3 px-5 pb-10"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                void load();
              }}
              {...REFRESH_CONTROL_PROPS}
            />
          }>
          {orders.length === 0 ? (
            <Text className="py-16 text-center font-geist text-[14px] text-muted">
              Investments, pool joins, and subscriptions you place will show here with their status.
            </Text>
          ) : (
            orders.map((order) => (
              <Pressable
                key={`${order.kind}-${order.id}`}
                accessibilityRole="button"
                onPress={() => router.push(order.href as Href)}
                className="rounded-[16px] border border-[#EFEFEF] bg-white p-4"
                style={({ pressed }) => [pressed && { opacity: 0.92 }]}>
                <View className="flex-row items-start justify-between gap-3">
                  <View className="min-w-0 flex-1">
                    <Text className="font-geist text-[11px] uppercase tracking-wide text-muted">
                      {KIND_LABEL[order.kind]}
                    </Text>
                    <Text className="mt-1 font-geist-bold text-[16px] text-stone-title">
                      {order.title}
                    </Text>
                  </View>
                  <Text className="font-geist-semibold text-[12px] uppercase text-[#8A6D10]">
                    {order.status}
                  </Text>
                </View>
                <Text className="mt-2 font-geist text-[14px] text-stone-body">
                  ${order.amountUsd.toFixed(2)}
                </Text>
                <Text className="mt-1 font-geist text-[12px] text-muted">
                  {order.reference ? `Ref ${order.reference} · ` : ''}
                  {new Date(order.createdAt).toLocaleString()}
                </Text>
              </Pressable>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}
