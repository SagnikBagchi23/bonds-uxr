import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useState } from 'react';
import { colors, textStyles } from '../../../../theme/tokens';
import { SegmentedToggle } from '../../../../components/SegmentedToggle';
import { BondSummaryCard } from '../../../../components/BondSummaryCard';
import { BondCard } from '../../../../components/BondCard';
import { activeBonds } from '../../../../data/bonds';
import { bondFinancials, portfolioSummary } from '../../../../data/payouts';

export default function HoldingsScreen() {
  const [activeTab, setActiveTab] = useState(1); // 0 = Stocks, 1 = Bonds
  const summary = portfolioSummary();

  return (
    <View style={styles.container}>
      <SegmentedToggle
        options={['Stocks', 'Bonds']}
        selectedIndex={activeTab}
        onSelect={setActiveTab}
      />
      <View style={styles.divider} />

      {activeTab === 0 ? (
        <View style={styles.placeholder}>
          <Text style={{ ...textStyles.headingBase, color: colors.contentSecondary }}>
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
          />

          <View style={styles.bondList}>
            {activeBonds.map((bond) => (
              <BondCard
                key={bond.id}
                bond={bond}
                financials={bondFinancials[bond.id]}
              />
            ))}
          </View>
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
  divider: {
    height: 1,
    backgroundColor: colors.borderPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
    gap: 0,
  },
  bondList: {
    marginTop: 16,
    gap: 12,
  },
  placeholder: {
    flex: 1,
  },
});
