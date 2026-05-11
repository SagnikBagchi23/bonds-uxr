import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Sorting01Icon, Search01Icon, QrCodeIcon, ChevronDoubleCloseIcon } from '@hugeicons/core-free-icons';
import { colors, textStyles, iconSizes } from '../../../../theme/tokens';
import { BondSummaryCard } from '../../../../components/BondSummaryCard';
import { BondCard } from '../../../../components/BondCard';
import { activeBonds } from '../../../../data/bonds';
import { bondFinancials, portfolioSummary } from '../../../../data/payouts';
import { useScrollBottom } from '../../../../hooks/useScrollBottom';

const SUB_TABS = ['Explore', 'Holdings', 'Positions', 'Orders', 'SIPs', 'Watchlist'];
const APP_BAR_HEIGHT = 56;

type DataState = 0 | 1 | 2;

const HEADER_LABELS: Record<DataState, string> = {
  0: 'Total/Invested',
  1: 'Interest earned',
  2: 'Price/Face value',
};

export default function HoldingsScreen() {
  const [activeChip, setActiveChip] = useState<'stocks' | 'bonds'>('bonds');
  const [dataState, setDataState] = useState<DataState>(0);
  const { setHasContentBelow, scrolledPastHeader, setScrolledPastHeader } = useScrollBottom();
  const summary = portfolioSummary();
  const sortedBonds = [...activeBonds].sort(
    (a, b) => bondFinancials[b.id].totalValue - bondFinancials[a.id].totalValue
  );

  const cycleDataState = () => {
    setDataState((s) => ((s + 1) % 3) as DataState);
  };

  const handleScroll = (e: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const y = contentOffset.y;
    setScrolledPastHeader(y > APP_BAR_HEIGHT);
    setHasContentBelow(y + layoutMeasurement.height < contentSize.height - 2);
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      stickyHeaderIndices={[1]}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      {/* 0: App bar — scrolls away */}
      <View>
        <View style={styles.appBar}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../../assets/groww-logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appBarTitle}>Stocks</Text>
          <View style={styles.trailingIcons}>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
              <HugeiconsIcon icon={Search01Icon} size={iconSizes.medium} color={colors.contentPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
              <HugeiconsIcon icon={QrCodeIcon} size={iconSizes.medium} color={colors.contentPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarBtn} activeOpacity={0.7}>
              <Image source={require('../../../../assets/growwdp.png')} style={styles.avatarImage} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.dividerLine} />
      </View>

      {/* 1: Sub-tab bar — sticky */}
      <View style={[styles.subTabContainer, scrolledPastHeader && styles.subTabContainerScrolled]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subTabContent}
        >
          {SUB_TABS.map((tab) => {
            const isActive = tab === 'Holdings';
            return (
              <TouchableOpacity key={tab} style={styles.subTab} activeOpacity={0.7}>
                <Text style={[styles.subTabLabel, isActive && styles.subTabLabelActive]}>
                  {tab}
                </Text>
                {isActive && <View style={styles.subTabIndicator} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={styles.dividerLine} />
      </View>

      {/* 2: Main content */}
      <View>
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
          <View style={styles.bondsContent}>
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
                  <HugeiconsIcon icon={Sorting01Icon} size={iconSizes.small} color={colors.contentSecondary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={cycleDataState} activeOpacity={0.7} style={styles.cycleBtn}>
                  <HugeiconsIcon icon={ChevronDoubleCloseIcon} size={iconSizes.small} color={colors.contentPrimary} />
                  <View style={styles.cycleBtnLabelFrame}>
                    <Text style={styles.cycleBtnText}>{HEADER_LABELS[dataState]}</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Bond list */}
              <View style={styles.bondList}>
                {sortedBonds.map((bond, i) => (
                  <BondCard
                    key={bond.id}
                    bond={bond}
                    financials={bondFinancials[bond.id]}
                    dataState={dataState}
                    showDivider={i < sortedBonds.length - 1}
                  />
                ))}
              </View>
            </View>

            <View style={{ height: 32 }} />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  // App bar
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: APP_BAR_HEIGHT,
    paddingHorizontal: 12,
    backgroundColor: colors.backgroundPrimary,
  },
  logoContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 80,
    height: 28,
  },
  appBarTitle: {
    ...textStyles.headingBase,
    color: colors.contentPrimary,
    flex: 1,
    paddingLeft: 4,
  },
  trailingIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    marginLeft: 4,
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  dividerLine: {
    height: 1,
    backgroundColor: colors.borderPrimary,
  },
  // Sub-tab bar
  subTabContainer: {
    backgroundColor: colors.backgroundPrimary,
  },
  subTabContainerScrolled: {
    backgroundColor: colors.backgroundSurfaceZ1,
  },
  subTabContent: {
    paddingHorizontal: 16,
  },
  subTab: {
    paddingHorizontal: 16,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  subTabLabel: {
    ...textStyles.headingSmall,
    color: colors.contentSecondary,
  },
  subTabLabelActive: {
    color: colors.contentPrimary,
  },
  subTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.borderNeutral,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  // Chip row
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
  // Bonds content
  bondsContent: {
    gap: 20,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  sortBtn: {
    paddingRight: 16,
    height: 36,
    justifyContent: 'center',
  },
  cycleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 24,
  },
  cycleBtnLabelFrame: {
    borderBottomWidth: 1,
    borderBottomColor: colors.contentSecondary,
    borderStyle: 'dashed',
  },
  cycleBtnText: {
    ...textStyles.bodySmallHeavy,
    color: colors.contentPrimary,
  },
  bondList: {
    backgroundColor: colors.backgroundPrimary,
  },
  placeholder: {
    alignItems: 'center',
    paddingTop: 120,
  },
});
