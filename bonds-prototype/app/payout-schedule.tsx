import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, textStyles, iconSizes } from '../theme/tokens';
import { useHideValues } from '../hooks/useHideValues';
import { upcomingPayouts, receivedPayouts, groupPayoutsByMonth } from '../data/payouts';

function formatINR(value: number): string {
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  return `₹${value.toLocaleString('en-IN')}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function PayoutScheduleScreen() {
  const [tab, setTab] = useState<'upcoming' | 'received'>('upcoming');
  const { mask } = useHideValues();
  const router = useRouter();

  const payouts = tab === 'upcoming' ? upcomingPayouts : receivedPayouts;
  const groups = groupPayoutsByMonth(payouts);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payouts</Text>
        <View style={styles.backBtn} />
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, tab === 'upcoming' && styles.tabActive]}
          onPress={() => setTab('upcoming')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabLabel, tab === 'upcoming' && styles.tabLabelActive]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'received' && styles.tabActive]}
          onPress={() => setTab('received')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabLabel, tab === 'received' && styles.tabLabelActive]}>
            Received
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabDivider} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {groups.map((group) => (
          <View key={group.monthKey} style={styles.monthGroup}>
            {/* Month header */}
            <View style={styles.monthHeader}>
              <Text style={styles.monthLabel}>{group.label}</Text>
              <Text style={styles.monthTotal}>{mask(formatINR(group.total))}</Text>
            </View>

            {/* Payout rows */}
            {group.payouts.map((payout) => (
              <View key={payout.id} style={styles.payoutRow}>
                <View style={styles.payoutLeft}>
                  <View style={[
                    styles.kindDot,
                    { backgroundColor: payout.kind === 'interest' ? colors.backgroundAccentSubtle : colors.backgroundWarningSubtle }
                  ]} />
                  <View style={styles.payoutInfo}>
                    <Text style={styles.payoutIssuer}>{payout.issuer}</Text>
                    <Text style={styles.payoutMeta}>
                      {payout.kind === 'interest' ? 'Interest' : 'Principal'} · {formatDate(payout.date)}
                    </Text>
                  </View>
                </View>
                <Text style={[
                  styles.payoutAmount,
                  payout.kind === 'principal' && { color: colors.contentWarning }
                ]}>
                  {mask(formatINR(payout.amount))}
                </Text>
              </View>
            ))}
          </View>
        ))}

        {groups.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No {tab} payouts</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    alignItems: 'flex-start',
  },
  backIcon: {
    fontSize: iconSizes.medium,
    color: colors.contentPrimary,
  },
  headerTitle: {
    ...textStyles.headingSmall,
    color: colors.contentPrimary,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 0,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginRight: 8,
  },
  tabActive: {
    borderBottomColor: colors.contentPrimary,
  },
  tabLabel: {
    ...textStyles.bodyBase,
    color: colors.contentSecondary,
  },
  tabLabelActive: {
    ...textStyles.bodyBaseHeavy,
    color: colors.contentPrimary,
  },
  tabDivider: {
    height: 1,
    backgroundColor: colors.borderPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 24,
    paddingBottom: 40,
  },
  monthGroup: {
    gap: 0,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  monthLabel: {
    ...textStyles.bodySmallHeavy,
    color: colors.contentSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  monthTotal: {
    ...textStyles.bodyBaseHeavy,
    color: colors.contentPrimary,
  },
  payoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderPrimary,
  },
  payoutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  kindDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  payoutInfo: {
    flex: 1,
    gap: 2,
  },
  payoutIssuer: {
    ...textStyles.bodyBase,
    color: colors.contentPrimary,
  },
  payoutMeta: {
    ...textStyles.bodySmall,
    color: colors.contentSecondary,
  },
  payoutAmount: {
    ...textStyles.bodyBaseHeavy,
    color: colors.contentPositive,
  },
  emptyState: {
    paddingTop: 80,
    alignItems: 'center',
  },
  emptyText: {
    ...textStyles.bodyBase,
    color: colors.contentSecondary,
  },
});
