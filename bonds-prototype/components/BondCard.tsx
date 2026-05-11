import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { colors, textStyles } from '../theme/tokens';
import { useHideValues } from '../hooks/useHideValues';
import type { Bond } from '../data/bonds';
import type { BondFinancials } from '../data/payouts';

interface BondCardProps {
  bond: Bond;
  financials: BondFinancials;
}

type DataState = 0 | 1 | 2;

const STATE_LABELS: Record<DataState, string> = {
  0: 'View Interest',
  1: 'View Price',
  2: 'View Value',
};

function formatINR(value: number): string {
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  return `₹${value.toLocaleString('en-IN')}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function RatingBadge({ rating }: { rating: string }) {
  const isHighGrade = ['AAA', 'AA+', 'AA', 'AA-'].includes(rating);
  const isMidGrade = ['A+', 'A', 'A-'].includes(rating);

  const bg = isHighGrade
    ? colors.backgroundAccentSubtle
    : isMidGrade
    ? colors.backgroundWarningSubtle
    : colors.backgroundNegativeSubtle;

  const fg = isHighGrade
    ? colors.contentOnAccentSubtle
    : isMidGrade
    ? colors.contentOnWarningSubtle
    : colors.contentOnNegativeSubtle;

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color: fg }]}>{rating}</Text>
    </View>
  );
}

export function BondCard({ bond, financials }: BondCardProps) {
  const [dataState, setDataState] = useState<DataState>(0);
  const { mask } = useHideValues();
  const router = useRouter();

  const cycleState = () => {
    setDataState((s) => ((s + 1) % 3) as DataState);
  };

  const daysToMaturity = Math.max(
    0,
    Math.ceil((new Date(bond.maturityDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/bond/${bond.id}`)}
      activeOpacity={0.8}
    >
      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={styles.issuerName}>{bond.issuer}</Text>
          <View style={styles.metaRow}>
            <RatingBadge rating={bond.rating} />
            <Text style={styles.metaText}>NCD</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaText}>{daysToMaturity}d to maturity</Text>
          </View>
        </View>
        {bond.payoutType === 'staggered' && (
          <View style={styles.staggeredBadge}>
            <Text style={styles.staggeredBadgeText}>Staggered</Text>
          </View>
        )}
      </View>

      <View style={styles.divider} />

      {/* Data state */}
      <Animated.View key={dataState} entering={FadeIn.duration(200)} style={styles.dataRow}>
        {dataState === 0 && (
          <>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Total Value</Text>
              <Text style={styles.dataValuePrimary}>{mask(formatINR(financials.totalValue))}</Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Invested</Text>
              <Text style={styles.dataValueSecondary}>{mask(formatINR(financials.invested))}</Text>
            </View>
          </>
        )}
        {dataState === 1 && (
          <View style={styles.dataItemFull}>
            <Text style={styles.dataLabel}>Interest earned</Text>
            <Text style={[styles.dataValuePrimary, { color: colors.contentPositive }]}>
              {mask(formatINR(financials.interestEarned))}
            </Text>
            <Text style={styles.dataSubLabel}>
              {mask(formatINR(financials.invested))} invested ·{' '}
              {bond.couponRate}% coupon
            </Text>
          </View>
        )}
        {dataState === 2 && (
          <>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Market Price</Text>
              <Text style={styles.dataValuePrimary}>{mask(formatINR(financials.marketPrice))}</Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Face Value</Text>
              <Text style={styles.dataValueSecondary}>
                {mask(formatINR(bond.faceValue * bond.units))}
              </Text>
            </View>
          </>
        )}
      </Animated.View>

      {/* Footer row: next payout + cycle button */}
      <View style={styles.footerRow}>
        {financials.nextPayoutDate ? (
          <Text style={styles.nextPayout}>
            Next payout{' '}
            <Text style={styles.nextPayoutDate}>{formatDate(financials.nextPayoutDate)}</Text>
            {' · '}
            <Text style={styles.nextPayoutAmount}>{mask(formatINR(financials.nextPayoutAmount))}</Text>
          </Text>
        ) : (
          <Text style={styles.nextPayout}>No upcoming payouts</Text>
        )}

        <TouchableOpacity onPress={cycleState} style={styles.cycleBtn} activeOpacity={0.7}>
          <Text style={styles.cycleBtnText}>{STATE_LABELS[dataState]}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundPrimary,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    padding: 16,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    gap: 6,
  },
  issuerName: {
    ...textStyles.bodyBaseHeavy,
    color: colors.contentPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    ...textStyles.bodySmall,
    color: colors.contentSecondary,
  },
  metaDot: {
    ...textStyles.bodySmall,
    color: colors.contentDisabled,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    ...textStyles.bodySmall,
    fontSize: 11,
    lineHeight: 16,
  },
  staggeredBadge: {
    backgroundColor: colors.backgroundWarningSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  staggeredBadgeText: {
    ...textStyles.bodySmall,
    color: colors.contentOnWarningSubtle,
    fontSize: 11,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderPrimary,
  },
  dataRow: {
    flexDirection: 'row',
    gap: 16,
  },
  dataItem: {
    flex: 1,
    gap: 2,
  },
  dataItemFull: {
    flex: 1,
    gap: 4,
  },
  dataLabel: {
    ...textStyles.bodySmall,
    color: colors.contentSecondary,
  },
  dataValuePrimary: {
    ...textStyles.headingSmall,
    color: colors.contentPrimary,
  },
  dataValueSecondary: {
    ...textStyles.headingSmall,
    color: colors.contentSecondary,
  },
  dataSubLabel: {
    ...textStyles.bodySmall,
    color: colors.contentSecondary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextPayout: {
    ...textStyles.bodySmall,
    color: colors.contentSecondary,
    flex: 1,
  },
  nextPayoutDate: {
    ...textStyles.bodySmall,
    color: colors.contentPrimary,
  },
  nextPayoutAmount: {
    ...textStyles.bodySmall,
    color: colors.contentPrimary,
  },
  cycleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
  },
  cycleBtnText: {
    ...textStyles.bodySmall,
    color: colors.contentPrimary,
  },
});
