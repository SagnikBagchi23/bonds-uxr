import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';
import { useRef, useState } from 'react';
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
const SUB_TAB_HEIGHT = 49; // 48px tab row + 1px divider

type DataState = 0 | 1 | 2;

const HEADER_LABELS: Record<DataState, string> = {
  0: 'Total/Invested',
  1: 'Interest earned',
  2: 'Price/Face value',
};

export default function HoldingsScreen() {
  const [activeChip, setActiveChip] = useState<'stocks' | 'bonds'>('bonds');
  const [dataState, setDataState] = useState<DataState>(0);
  const { setHasContentBelow, setScrolledPastHeader } = useScrollBottom();
  const summary = portfolioSummary();
  const sortedBonds = [...activeBonds].sort(
    (a, b) => bondFinancials[b.id].totalValue - bondFinancials[a.id].totalValue
  );

  const scrollY = useRef(new Animated.Value(0)).current;

  // Sub-tab bar rides up with scroll until it hits the top — pure transform, GPU-accelerated
  const subtabTranslateY = scrollY.interpolate({
    inputRange: [0, APP_BAR_HEIGHT],
    outputRange: [APP_BAR_HEIGHT, 0],
    extrapolate: 'clamp',
  });

  // Background snaps at threshold; color delta is subtle so interpolation isn't noticeable
  const subtabBg = scrollY.interpolate({
    inputRange: [APP_BAR_HEIGHT - 1, APP_BAR_HEIGHT],
    outputRange: [colors.backgroundPrimary, colors.backgroundSurfaceZ1],
    extrapolate: 'clamp',
  });

  const cycleDataState = () => {
    setDataState((s) => ((s + 1) % 3) as DataState);
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (e: any) => {
        const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
        const y = contentOffset.y;
        setScrolledPastHeader(y >= APP_BAR_HEIGHT);
        setHasContentBelow(y + layoutMeasurement.height < contentSize.height - 2);
      },
    }
  );

  return (
    <View style={styles.root}>
      {/* Sub-tab bar — absolute overlay, translateY driven by scrollY */}
      <Animated.View
        style={[
          styles.subTabContainer,
          {
            transform: [{ translateY: subtabTranslateY }],
            backgroundColor: subtabBg,
          },
        ]}
      >
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
      </Animated.View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* App bar — scrolls away naturally */}
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

        {/* Spacer: reserves sub-tab bar height in scroll flow so content doesn't hide behind it */}
        <View style={styles.subTabSpacer} />

        {/* Main content */}
        <View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  contentContainer: {
    backgroundColor: colors.backgroundPrimary,
  },
  // Sub-tab bar (absolute, scroll-driven)
  subTabContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
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
  subTabSpacer: {
    height: SUB_TAB_HEIGHT,
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
