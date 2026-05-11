import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, textStyles } from '../theme/tokens';
import { useHideValues } from '../hooks/useHideValues';

interface BondSummaryCardProps {
  totalValue: number;
  totalInvested: number;
  totalInterest: number;
  hasStaggered: boolean;
  principalReturned: number;
}

function formatINR(value: number): string {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)}L`;
  }
  return `₹${value.toLocaleString('en-IN')}`;
}

export function BondSummaryCard({
  totalValue,
  totalInvested,
  totalInterest,
  hasStaggered,
  principalReturned,
}: BondSummaryCardProps) {
  const { hidden, toggle, mask } = useHideValues();
  const router = useRouter();

  return (
    <View style={styles.card}>
      {/* Top row: label + eye icon */}
      <View style={styles.topRow}>
        <Text style={styles.sectionLabel}>Current Value</Text>
        <TouchableOpacity onPress={toggle} style={styles.eyeButton} activeOpacity={0.7}>
          <Text style={styles.eyeIcon}>{hidden ? '👁️‍🗨️' : '👁️'}</Text>
        </TouchableOpacity>
      </View>

      {/* Total value */}
      <Text style={styles.totalValue}>{mask(formatINR(totalValue))}</Text>

      {/* Invested + Interest row */}
      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Invested</Text>
          <Text style={styles.metricValue}>{mask(formatINR(totalInvested))}</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Interest earned</Text>
          <Text style={[styles.metricValue, { color: colors.contentPositive }]}>
            {mask(formatINR(totalInterest))}
          </Text>
        </View>
      </View>

      {/* Staggered principal callout */}
      {hasStaggered && !hidden && (
        <View style={styles.principalBanner}>
          <Text style={styles.principalBannerText}>
            + {formatINR(principalReturned)} principal returned early across bonds
          </Text>
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push('/payout-schedule')}
          activeOpacity={0.7}
        >
          <Text style={styles.actionBtnText}>View Payouts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push('/matured-bonds')}
          activeOpacity={0.7}
        >
          <Text style={styles.actionBtnText}>Matured Bonds</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundPrimary,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    padding: 16,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    ...textStyles.bodySmall,
    color: colors.contentSecondary,
  },
  eyeButton: {
    padding: 4,
  },
  eyeIcon: {
    fontSize: 18,
  },
  totalValue: {
    ...textStyles.displayBase,
    color: colors.contentPrimary,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metric: {
    flex: 1,
    gap: 2,
  },
  metricLabel: {
    ...textStyles.bodySmall,
    color: colors.contentSecondary,
  },
  metricValue: {
    ...textStyles.bodyBaseHeavy,
    color: colors.contentPrimary,
  },
  metricDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.borderPrimary,
  },
  principalBanner: {
    backgroundColor: colors.backgroundAccentSubtle,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  principalBannerText: {
    ...textStyles.bodySmall,
    color: colors.contentOnAccentSubtle,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  actionBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  actionBtnText: {
    ...textStyles.bodySmall,
    color: colors.contentPrimary,
  },
});
