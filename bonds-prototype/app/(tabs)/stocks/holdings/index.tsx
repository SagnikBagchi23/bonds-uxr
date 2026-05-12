import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Easing,
} from 'react-native';
import { useRef, useState, useCallback } from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Sorting01Icon, Search01Icon, QrCodeIcon, ChevronDoubleCloseIcon } from '@hugeicons/core-free-icons';
import { colors, textStyles, iconSizes } from '../../../../theme/tokens';
import { BondSummaryCard } from '../../../../components/BondSummaryCard';
import { BondCard } from '../../../../components/BondCard';
import { StockSummaryCard } from '../../../../components/StockSummaryCard';
import { StockCard } from '../../../../components/StockCard';
import { activeBonds } from '../../../../data/bonds';
import { bondFinancials, portfolioSummary } from '../../../../data/payouts';
import { stocks, stockFinancials, stockPortfolioSummary } from '../../../../data/stocks';
import { useScrollBottom } from '../../../../hooks/useScrollBottom';

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

const SUB_TABS = ['Explore', 'Holdings', 'Positions', 'Orders', 'SIPs', 'Watchlist'];
const APP_BAR_HEIGHT = 56;

type DataState = 0 | 1 | 2;

const BOND_HEADER_LABELS: Record<DataState, string> = {
  0: 'Total/Invested',
  1: 'Interest earned',
  2: 'Price/Face value',
};

const STOCK_HEADER_LABELS: Record<DataState, string> = {
  0: 'Current/Cost',
  1: 'P&L',
  2: 'Returns %',
};

export default function HoldingsScreen() {
  const [activeChip, setActiveChip] = useState<'stocks' | 'bonds'>('bonds');
  const [bondsDataState, setBondsDataState] = useState<DataState>(0);
  const [stocksDataState, setStocksDataState] = useState<DataState>(0);
  const { setHasContentBelow, setScrolledPastHeader } = useScrollBottom();

  const bondSummary = portfolioSummary();
  const stockSummary = stockPortfolioSummary();

  const sortedBonds = [...activeBonds].sort(
    (a, b) => bondFinancials[b.id].totalValue - bondFinancials[a.id].totalValue
  );
  const sortedStocks = [...stocks].sort(
    (a, b) => stockFinancials[b.id].currentValue - stockFinancials[a.id].currentValue
  );

  const dataState = activeChip === 'bonds' ? bondsDataState : stocksDataState;
  const currentHeaderLabel =
    activeChip === 'bonds' ? BOND_HEADER_LABELS[bondsDataState] : STOCK_HEADER_LABELS[stocksDataState];

  const cycleDataState = () => {
    if (activeChip === 'bonds') {
      setBondsDataState((s) => ((s + 1) % 3) as DataState);
    } else {
      setStocksDataState((s) => ((s + 1) % 3) as DataState);
    }
  };

  // Scroll-driven header elevation
  const scrollYJS = useRef(new Animated.Value(0)).current;
  const headerBg = scrollYJS.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.backgroundPrimary, colors.backgroundSurfaceZ1],
    extrapolate: 'clamp',
  });
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollYJS } } }],
    {
      useNativeDriver: false,
      listener: (e: any) => {
        const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
        const y = contentOffset.y;
        setScrolledPastHeader(y > 0);
        setHasContentBelow(y + layoutMeasurement.height < contentSize.height - 2);
      },
    }
  );

  // Animated pill for chip toggle
  const chipRowRef = useRef<View>(null);
  const stocksChipRef = useRef<View>(null);
  const bondsChipRef = useRef<View>(null);
  const pillLeftAnim = useRef(new Animated.Value(0)).current;
  const pillWidthAnim = useRef(new Animated.Value(0)).current;
  const [pillTop, setPillTop] = useState(0);
  const [pillHeight, setPillHeight] = useState(0);
  const [pillReady, setPillReady] = useState(false);

  const measureChip = useCallback(
    (chip: 'stocks' | 'bonds', animate: boolean) => {
      const chipRef = chip === 'stocks' ? stocksChipRef.current : bondsChipRef.current;
      const container = chipRowRef.current;
      if (!chipRef || !container) return;
      chipRef.measureLayout(
        container,
        (x: number, y: number, width: number, height: number) => {
          if (animate) {
            Animated.parallel([
              Animated.timing(pillLeftAnim, { toValue: x, duration: 150, easing: EASE_OUT, useNativeDriver: false }),
              Animated.timing(pillWidthAnim, { toValue: width, duration: 150, easing: EASE_OUT, useNativeDriver: false }),
            ]).start();
          } else {
            pillLeftAnim.setValue(x);
            pillWidthAnim.setValue(width);
            setPillTop(y);
            setPillHeight(height);
            setPillReady(true);
          }
        },
        () => {}
      );
    },
    [pillLeftAnim, pillWidthAnim]
  );

  const handleChipRowLayout = useCallback(() => {
    // Set initial pill position to the active chip (bonds) without animation
    measureChip('bonds', false);
  }, [measureChip]);

  const handleChipPress = (chip: 'stocks' | 'bonds') => {
    setActiveChip(chip);
    measureChip(chip, true);
  };

  return (
    <View style={styles.root}>
      {/* Sticky header */}
      <Animated.View style={[styles.stickyHeader, { backgroundColor: headerBg }]}>
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subTabContent}
        >
          {SUB_TABS.map((tab) => {
            const isActive = tab === 'Holdings';
            return (
              <TouchableOpacity key={tab} style={styles.subTab} activeOpacity={0.7}>
                <Text style={[styles.subTabLabel, isActive && styles.subTabLabelActive]}>{tab}</Text>
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
        <View>
          {/* Chip toggle with animated sliding pill */}
          <View ref={chipRowRef} style={styles.chipRow} onLayout={handleChipRowLayout}>
            {pillReady && (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.pill,
                  {
                    left: pillLeftAnim,
                    top: pillTop,
                    height: pillHeight,
                    width: pillWidthAnim,
                  },
                ]}
              />
            )}
            <View ref={stocksChipRef}>
              <TouchableOpacity
                onPress={() => handleChipPress('stocks')}
                activeOpacity={0.7}
                style={styles.chip}
              >
                <Text style={[styles.chipLabel, activeChip !== 'stocks' && styles.chipLabelInactive]}>
                  STOCKS
                </Text>
              </TouchableOpacity>
            </View>
            <View ref={bondsChipRef}>
              <TouchableOpacity
                onPress={() => handleChipPress('bonds')}
                activeOpacity={0.7}
                style={styles.chip}
              >
                <Text style={[styles.chipLabel, activeChip !== 'bonds' && styles.chipLabelInactive]}>
                  BONDS
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {activeChip === 'stocks' ? (
            <View style={styles.bondsContent}>
              <StockSummaryCard
                totalValue={stockSummary.totalValue}
                totalInvested={stockSummary.totalInvested}
                totalPnl={stockSummary.totalPnl}
                totalPnlPct={stockSummary.totalPnlPct}
                stockCount={stocks.length}
              />

              <View>
                <View style={styles.listHeader}>
                  <TouchableOpacity style={styles.sortBtn} activeOpacity={0.7}>
                    <HugeiconsIcon icon={Sorting01Icon} size={iconSizes.small} color={colors.contentSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={cycleDataState} activeOpacity={0.7} style={styles.cycleBtn}>
                    <HugeiconsIcon icon={ChevronDoubleCloseIcon} size={iconSizes.small} color={colors.contentPrimary} />
                    <View style={styles.cycleBtnLabelFrame}>
                      <Text style={styles.cycleBtnText}>{currentHeaderLabel}</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.bondList}>
                  {sortedStocks.map((stock, i) => (
                    <StockCard
                      key={stock.id}
                      stock={stock}
                      financials={stockFinancials[stock.id]}
                      dataState={stocksDataState}
                      showDivider={i < sortedStocks.length - 1}
                    />
                  ))}
                </View>
              </View>

              <View style={{ height: 32 }} />
            </View>
          ) : (
            <View style={styles.bondsContent}>
              <BondSummaryCard
                totalValue={bondSummary.totalValue}
                totalInvested={bondSummary.totalInvested}
                totalInterest={bondSummary.totalInterest}
                hasStaggered={bondSummary.hasStaggered}
                principalReturned={bondSummary.principalReturned}
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
                      <Text style={styles.cycleBtnText}>{currentHeaderLabel}</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.bondList}>
                  {sortedBonds.map((bond, i) => (
                    <BondCard
                      key={bond.id}
                      bond={bond}
                      financials={bondFinancials[bond.id]}
                      dataState={bondsDataState}
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
  stickyHeader: {},
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
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: APP_BAR_HEIGHT,
    paddingHorizontal: 12,
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
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    gap: 4,
    position: 'relative',
  },
  pill: {
    position: 'absolute',
    borderRadius: 99,
    backgroundColor: colors.backgroundTertiary,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
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
});
