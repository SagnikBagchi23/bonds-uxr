import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Sorting01Icon } from '@hugeicons/core-free-icons';
import { colors, textStyles, iconSizes } from '../../../../theme/tokens';
import { BondSummaryCard } from '../../../../components/BondSummaryCard';
import { BondCard } from '../../../../components/BondCard';
import { activeBonds } from '../../../../data/bonds';
import { bondFinancials, portfolioSummary } from '../../../../data/payouts';

type DataState = 0 | 1 | 2;

const HEADER_LABELS: Record<DataState, string> = {
  0: 'Total/Invested',
  1: 'Interest earned',
  2: 'Price/Face value',
};

export default function HoldingsScreen() {
  const [activeChip, setActiveChip] = useState<'stocks' | 'bonds'>('bonds');
  const [dataState, setDataState] = useState<DataState>(0);
  const summary = portfolioSummary();

  const cycleDataState = () => {
    setDataState((s) => ((s + 1) % 3) as DataState);
  };

  return (
    <View style={styles.container}>
      {/* Chip row */}
      <View style={styles.chipRow}>
        <TouchableOpacity
          style={[styles.chip, activeChip === 'stocks' && styles.chipInactive]}
          onPress={() => setActiveChip('stocks')}
          activeOpacity={0.7}
        >
          <Text style={[styles.chipLabel, activeChip !== 'stocks' && styles.chipLabelInactive]}>
            STOCKS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, activeChip === 'bonds' && styles.chipActive]}
          onPress={() => setActiveChip('bonds')}
          activeOpacity={0.7}
        >
          <Text style={[styles.chipLabel, activeChip !== 'bonds' && styles.chipLabelInactive]}>
            BONDS
          </Text>
        </TouchableOpacity>
      </View>

      {activeChip === 'stocks' ? (
        <View style={styles.placeholder}>
          <Text style={[textStyles.bodyBase, { color: colors.contentSecondary }]}>
            Stocks Holdings
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <BondSummaryCard
            totalValue={summary.totalValue}
            totalInvested={summary.totalInvested}
            totalInterest={summary.totalInterest}
            hasStaggered={summary.hasStaggered}
            principalReturned={summary.principalReturned}
            bondCount={activeBonds.length}
          />

          <View>
            {/* Bond list header */}
            <View style={styles.listHeader}>
              <TouchableOpacity style={styles.sortBtn} activeOpacity={0.7}>
                <HugeiconsIcon icon={Sorting01Icon} size={iconSizes.medium} color={colors.contentSecondary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={cycleDataState} activeOpacity={0.7} style={styles.cycleBtn}>
                <Text style={styles.cycleBtnText}>{HEADER_LABELS[dataState]}</Text>
              </TouchableOpacity>
            </View>

            {/* Bond list */}
            <View style={styles.bondList}>
              {activeBonds.map((bond, i) => (
                <BondCard
                  key={bond.id}
                  bond={bond}
                  financials={bondFinancials[bond.id]}
                  dataState={dataState}
                  showDivider={i < activeBonds.length - 1}
                />
              ))}
            </View>
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    gap: 4,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
  },
  chipActive: {
    backgroundColor: colors.backgroundTertiary,
  },
  chipInactive: {
    backgroundColor: 'transparent',
  },
  chipLabel: {
    ...textStyles.headingEyebrow,
    color: colors.contentPrimary,
    textTransform: 'uppercase',
  },
  chipLabelInactive: {
    color: colors.contentSecondary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: 20,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  sortBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cycleBtn: {
    height: 24,
    justifyContent: 'center',
  },
  cycleBtnText: {
    ...textStyles.bodySmallHeavy,
    color: colors.contentPrimary,
  },
  bondList: {
    backgroundColor: colors.backgroundPrimary,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
