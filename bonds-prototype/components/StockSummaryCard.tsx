import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  EyeIcon,
  ViewOffSlashIcon,
  ChartUpIcon,
  MoreVerticalIcon,
} from '@hugeicons/core-free-icons';
import { colors, textStyles, iconSizes } from '../theme/tokens';
import { useHideValues } from '../hooks/useHideValues';

interface StockSummaryCardProps {
  totalValue: number;
  totalInvested: number;
  totalPnl: number;
  totalPnlPct: number;
  oneDayPnl: number;
  oneDayPnlPct: number;
  stockCount: number;
}

function formatINR(value: number): string {
  return '₹' + Math.abs(value).toLocaleString('en-IN');
}

function IconCircleBtn({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.iconCircle} onPress={onPress} activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
}

export function StockSummaryCard({
  totalValue,
  totalInvested,
  totalPnl,
  totalPnlPct,
  oneDayPnl,
  oneDayPnlPct,
  stockCount,
}: StockSummaryCardProps) {
  const { hidden, toggle, mask, maskStyle } = useHideValues();

  const isOneDayGain = oneDayPnl >= 0;
  const isTotalGain = totalPnl >= 0;

  function returnStr(amount: number, pct: number, isGain: boolean): string {
    const maskedAmt = mask(formatINR(amount));
    const maskedPct = mask(`${Math.abs(pct).toFixed(2)}%`);
    if (maskedAmt !== '••••••') {
      const sign = isGain ? '+' : '-';
      return `${sign}${maskedAmt} (${maskedPct})`;
    }
    return maskedAmt;
  }

  const oneDayStr = returnStr(oneDayPnl, oneDayPnlPct, isOneDayGain);
  const totalStr = returnStr(totalPnl, totalPnlPct, isTotalGain);

  return (
    <View style={styles.card}>
      <View style={styles.topSection}>
        <View style={styles.valueBlock}>
          <Text style={styles.eyebrow}>HOLDINGS ({stockCount})</Text>
          <Text style={[styles.totalValue, maskStyle]}>{mask(formatINR(totalValue))}</Text>
        </View>
        <View style={styles.iconGroup}>
          <IconCircleBtn onPress={toggle}>
            <HugeiconsIcon
              icon={hidden ? ViewOffSlashIcon : EyeIcon}
              size={iconSizes.small}
              color={colors.contentSecondary}
            />
          </IconCircleBtn>
          <IconCircleBtn>
            <HugeiconsIcon icon={ChartUpIcon} size={iconSizes.small} color={colors.contentSecondary} />
          </IconCircleBtn>
          <IconCircleBtn>
            <HugeiconsIcon icon={MoreVerticalIcon} size={iconSizes.small} color={colors.contentSecondary} />
          </IconCircleBtn>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.listContainer}>
        <View style={styles.listRow}>
          <Text style={styles.listLabel}>1D returns</Text>
          <Text style={[
            styles.listValue,
            { color: isOneDayGain ? colors.contentPositive : colors.contentNegative },
            maskStyle,
          ]}>
            {oneDayStr}
          </Text>
        </View>
        <View style={styles.listRow}>
          <Text style={styles.listLabel}>Total returns</Text>
          <Text style={[
            styles.listValue,
            { color: isTotalGain ? colors.contentPositive : colors.contentNegative },
            maskStyle,
          ]}>
            {totalStr}
          </Text>
        </View>
        <View style={styles.listRow}>
          <Text style={styles.listLabel}>Invested</Text>
          <Text style={[styles.listValue, { color: colors.contentPrimary }, maskStyle]}>
            {mask(formatINR(totalInvested))}
          </Text>
        </View>
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
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 8,
  },
  valueBlock: {
    flex: 1,
    gap: 4,
  },
  eyebrow: {
    ...textStyles.headingEyebrow,
    color: colors.contentSecondary,
    textTransform: 'uppercase',
  },
  totalValue: {
    ...textStyles.headingLarge,
    color: colors.contentPrimary,
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  divider: {
    height: 0,
    borderTopWidth: 1,
    borderTopColor: colors.borderPrimary,
    borderStyle: 'dashed',
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
  listValue: {
    ...textStyles.bodyBaseHeavy,
    textAlign: 'right',
  },
});
