import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, textStyles } from '../theme/tokens';
import { useHideValues } from '../hooks/useHideValues';
import type { Bond } from '../data/bonds';
import type { BondFinancials } from '../data/payouts';

interface BondCardProps {
  bond: Bond;
  financials: BondFinancials;
  dataState: 0 | 1 | 2;
  showDivider: boolean;
}

function formatINR(value: number): string {
  return '₹' + value.toLocaleString('en-IN');
}

function maturityLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = String(d.getFullYear()).slice(2);
  return `${month} '${year}`;
}

export function BondCard({ bond, financials, dataState, showDivider }: BondCardProps) {
  const { mask } = useHideValues();
  const router = useRouter();

  const displayName = `${bond.issuer} ${maturityLabel(bond.maturityDate)}`;

  let primaryValue: string;
  let secondaryValue: string;
  let primaryColor: string = colors.contentPositive;

  if (dataState === 0) {
    primaryValue = mask(formatINR(financials.totalValue));
    secondaryValue = mask(formatINR(financials.invested));
    primaryColor = colors.contentPositive;
  } else if (dataState === 1) {
    const earned = mask(formatINR(financials.interestEarned));
    primaryValue = earned.startsWith('₹') ? `+${earned}` : earned;
    secondaryValue = '';
    primaryColor = colors.contentPositive;
  } else {
    primaryValue = mask(formatINR(financials.marketPricePerUnit));
    secondaryValue = mask(formatINR(bond.faceValue));
    primaryColor = colors.contentPrimary;
  }

  return (
    <TouchableOpacity
      onPress={() => router.push(`/bond/${bond.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.row}>
        <View style={styles.spacerLeft} />
        <View style={styles.content}>
          <View style={styles.leading}>
            <Text style={styles.bondName} numberOfLines={1}>{displayName}</Text>
            <Text style={styles.units}>{bond.units} units</Text>
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
  spacerLeft: {
    width: 16,
  },
  spacerRight: {
    width: 16,
  },
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
  bondName: {
    ...textStyles.bodyBase,
    color: colors.contentPrimary,
  },
  units: {
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
