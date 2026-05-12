import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  EyeIcon,
  ViewOffSlashIcon,
  InformationCircleIcon,
} from '@hugeicons/core-free-icons';
import { colors, textStyles, iconSizes } from '../theme/tokens';
import { useHideValues } from '../hooks/useHideValues';

interface StockSummaryCardProps {
  totalValue: number;
  totalInvested: number;
  totalPnl: number;
  totalPnlPct: number;
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
  stockCount,
}: StockSummaryCardProps) {
  const { hidden, toggle, mask } = useHideValues();
  const isGain = totalPnl >= 0;

  const maskedPnl = mask(formatINR(totalPnl));
  const pnlStr = maskedPnl.startsWith('₹') ? (isGain ? '+' : '-') + maskedPnl : maskedPnl;
  const pnlPctStr = mask(`${Math.abs(totalPnlPct).toFixed(2)}%`);
  const pnlPctWithSign = pnlPctStr.includes('%') ? (isGain ? '+' : '-') + pnlPctStr : pnlPctStr;

  return (
    <View style={styles.card}>
      <View style={styles.topSection}>
        <View style={styles.valueBlock}>
          <View style={styles.labelRow}>
            <Text style={styles.eyebrow}>TOTAL VALUE ({stockCount})</Text>
            <HugeiconsIcon icon={InformationCircleIcon} size={iconSizes.xsmall} color={colors.contentSecondary} />
          </View>
          <Text style={styles.totalValue}>{mask(formatINR(totalValue))}</Text>
        </View>
        <IconCircleBtn onPress={toggle}>
          <HugeiconsIcon
            icon={hidden ? ViewOffSlashIcon : EyeIcon}
            size={iconSizes.small}
            color={colors.contentSecondary}
          />
        </IconCircleBtn>
      </View>

      <View style={styles.divider} />

      <View style={styles.listContainer}>
        <View style={styles.listRow}>
          <Text style={styles.listLabel}>Invested</Text>
          <Text style={styles.listValuePrimary}>{mask(formatINR(totalInvested))}</Text>
        </View>
        <View style={styles.listRow}>
          <Text style={styles.listLabel}>P&amp;L</Text>
          <View style={styles.pnlCell}>
            <Text style={[styles.listValuePnl, { color: isGain ? colors.contentPositive : colors.contentNegative }]}>
              {pnlStr}
            </Text>
            <Text style={[styles.pnlPct, { color: isGain ? colors.contentPositive : colors.contentNegative }]}>
              {pnlPctWithSign}
            </Text>
          </View>
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
  totalValue: {
    ...textStyles.headingLarge,
    color: colors.contentPrimary,
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
  listValuePrimary: {
    ...textStyles.bodyBaseHeavy,
    color: colors.contentPrimary,
  },
  pnlCell: {
    alignItems: 'flex-end',
    gap: 2,
  },
  listValuePnl: {
    ...textStyles.bodyBaseHeavy,
  },
  pnlPct: {
    ...textStyles.bodySmall,
  },
});
