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
  bondCount: number;
}

function formatINR(value: number): string {
  return '₹' + value.toLocaleString('en-IN');
}

function IconCircleBtn({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.iconCircle} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.iconCircleText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function BondSummaryCard({
  totalValue,
  totalInvested,
  totalInterest,
  hasStaggered,
  principalReturned,
  bondCount,
}: BondSummaryCardProps) {
  const { hidden, toggle, mask } = useHideValues();
  const router = useRouter();

  return (
    <View style={styles.card}>
      {/* Top section: value label + large number + icon buttons */}
      <View style={styles.topSection}>
        <View style={styles.valueBlock}>
          <View style={styles.labelRow}>
            <Text style={styles.eyebrow}>TOTAL VALUE ({bondCount})</Text>
            <Text style={styles.infoIcon}>ⓘ</Text>
          </View>
          <Text style={styles.totalValue}>{mask(formatINR(totalValue))}</Text>
        </View>
        <View style={styles.iconGroup}>
          <IconCircleBtn label="◉" onPress={toggle} />
          <IconCircleBtn label="⊟" onPress={() => router.push('/payout-schedule')} />
          <IconCircleBtn label="⋯" />
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* List rows */}
      <View style={styles.listContainer}>
        <View style={styles.listRow}>
          <Text style={styles.listLabel}>Invested</Text>
          <Text style={styles.listValuePrimary}>{mask(formatINR(totalInvested))}</Text>
        </View>
        <View style={styles.listRow}>
          <Text style={styles.listLabel}>Interest earned</Text>
          <Text style={styles.listValuePositive}>+{mask(formatINR(totalInterest))}</Text>
        </View>

        {hasStaggered && (
          <>
            <View style={styles.divider} />
            <View style={styles.listRow}>
              <Text style={styles.listLabel}>Principal returned</Text>
              <Text style={styles.listValuePrimary}>{mask(formatINR(principalReturned))}</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundSurfaceZ1,
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    overflow: 'hidden',
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  valueBlock: {
    flex: 1,
    gap: 4,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eyebrow: {
    ...textStyles.headingEyebrow,
    color: colors.contentSecondary,
    textTransform: 'uppercase',
  },
  infoIcon: {
    fontSize: 12,
    color: colors.contentSecondary,
    lineHeight: 14,
  },
  totalValue: {
    ...textStyles.headingLarge,
    color: colors.contentPrimary,
  },
  iconGroup: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleText: {
    fontSize: 16,
    color: colors.contentSecondary,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderPrimary,
    marginHorizontal: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listLabel: {
    ...textStyles.bodyBase,
    color: colors.contentSecondary,
  },
  listValuePrimary: {
    ...textStyles.bodyBaseHeavy,
    color: colors.contentPrimary,
  },
  listValuePositive: {
    ...textStyles.bodyBaseHeavy,
    color: colors.contentPositive,
  },
});
