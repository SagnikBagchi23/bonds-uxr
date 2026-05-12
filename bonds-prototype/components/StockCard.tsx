import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, textStyles } from '../theme/tokens';
import { useHideValues } from '../hooks/useHideValues';
import type { Stock, StockFinancials } from '../data/stocks';

interface StockCardProps {
  stock: Stock;
  financials: StockFinancials;
  dataState: 0 | 1 | 2;
  showDivider: boolean;
}

function formatINR(value: number): string {
  return '₹' + Math.abs(value).toLocaleString('en-IN');
}

export function StockCard({ stock, financials, dataState, showDivider }: StockCardProps) {
  const { mask } = useHideValues();
  const isGain = financials.pnl >= 0;

  let primaryValue: string;
  let secondaryValue: string;
  let primaryColor: string;

  if (dataState === 0) {
    primaryValue = mask(formatINR(financials.currentValue));
    secondaryValue = mask(formatINR(financials.invested));
    primaryColor = colors.contentPrimary;
  } else if (dataState === 1) {
    const masked = mask(formatINR(financials.pnl));
    primaryValue = masked.startsWith('₹') ? (isGain ? '+' : '-') + masked : masked;
    secondaryValue = '';
    primaryColor = isGain ? colors.contentPositive : colors.contentNegative;
  } else {
    const pct = mask(`${Math.abs(financials.pnlPct).toFixed(2)}%`);
    primaryValue = pct.includes('%') ? (isGain ? '+' : '-') + pct : pct;
    secondaryValue = mask(formatINR(financials.currentValue));
    primaryColor = isGain ? colors.contentPositive : colors.contentNegative;
  }

  return (
    <TouchableOpacity activeOpacity={0.7}>
      <View style={styles.row}>
        <View style={styles.spacerLeft} />
        <View style={styles.content}>
          <View style={styles.leading}>
            <Text style={styles.stockName} numberOfLines={1}>{stock.name}</Text>
            <Text style={styles.meta}>{stock.units} shares · {stock.ticker}</Text>
          </View>
          <View style={[styles.trailing, dataState === 1 && styles.trailingCentered]}>
            <Text style={[styles.primaryValue, { color: primaryColor }]}>{primaryValue}</Text>
            {secondaryValue ? <Text style={styles.secondaryValue}>{secondaryValue}</Text> : null}
          </View>
        </View>
        <View style={styles.spacerRight} />
      </View>
      {showDivider && (
        <View style={styles.dividerWrapper}>
          <View style={styles.divider} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  spacerLeft: { width: 16 },
  spacerRight: { width: 16 },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  leading: {
    flex: 1,
    gap: 2,
  },
  stockName: {
    ...textStyles.bodyBase,
    color: colors.contentPrimary,
  },
  meta: {
    ...textStyles.bodySmall,
    color: colors.contentSecondary,
  },
  trailing: {
    width: 96,
    alignItems: 'flex-end',
    gap: 2,
  },
  trailingCentered: {
    justifyContent: 'center',
  },
  primaryValue: {
    ...textStyles.bodyBaseHeavy,
    textAlign: 'right',
  },
  secondaryValue: {
    ...textStyles.bodySmall,
    color: colors.contentSecondary,
    textAlign: 'right',
  },
  dividerWrapper: {
    paddingLeft: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderPrimary,
  },
});
