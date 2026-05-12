import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, FilterIcon } from '@hugeicons/core-free-icons';
import { colors, textStyles, iconSizes } from '../theme/tokens';
import { useHideValues } from '../hooks/useHideValues';
import {
  allPayouts,
  upcomingPayouts,
  receivedPayouts,
  groupPayoutsByMonth,
} from '../data/payouts';
import { bonds, activeBonds } from '../data/bonds';

// --- helpers ---

function formatINR(value: number): string {
  return '₹' + Math.round(value).toLocaleString('en-IN');
}

function formatPayoutDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function maturityLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = String(d.getFullYear()).slice(2);
  return `${month} '${year}`;
}

function monthGroupLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const d = new Date(parseInt(year), parseInt(month) - 1, 1);
  const mon = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  return `${mon} '${year.slice(2)}`;
}

function companyInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

const AVATAR_PALETTE = [
  '#1A3A5C',
  '#1A2E4A',
  '#2C1A5C',
  '#1A4A2E',
  '#4A2E1A',
  '#1A3A4A',
  '#3A1A4A',
  '#1A4A3A',
];

function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

// --- derived data ---

const bondById = Object.fromEntries(bonds.map((b) => [b.id, b]));

const totalProjectedInterest = allPayouts
  .filter((p) => p.kind === 'interest')
  .reduce((s, p) => s + p.amount, 0);

const totalReceivedInterest = allPayouts
  .filter((p) => p.kind === 'interest' && p.received)
  .reduce((s, p) => s + p.amount, 0);

function headerSubtitle(): string {
  const count = activeBonds.length;
  const freqs = new Set(activeBonds.map((b) => b.couponFrequency));
  const freqLabel =
    freqs.size === 1
      ? freqs.has('monthly')
        ? 'Monthly'
        : freqs.has('semi-annual')
        ? 'Semi-annual'
        : 'Annual'
      : 'Mixed';
  return `${count} Bonds • ${freqLabel} interest payout`;
}

// --- sub-components ---

function CompanyAvatar({ name }: { name: string }) {
  return (
    <View style={[styles.avatar, { backgroundColor: avatarColor(name) }]}>
      <Text style={styles.avatarText}>{companyInitials(name)}</Text>
    </View>
  );
}

function InterestEarnedCard() {
  const { mask, maskStyle } = useHideValues();
  const [trackWidth, setTrackWidth] = useState(0);
  const ratio = totalProjectedInterest > 0 ? totalReceivedInterest / totalProjectedInterest : 0;

  const onTrackLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  return (
    <View style={styles.earnedCard}>
      <View style={styles.earnedCardContent}>
        <Text style={styles.earnedEyebrow}>INTEREST EARNED</Text>
        <View style={styles.earnedAmountRow}>
          <Text style={[styles.earnedAmount, maskStyle]}>
            {mask(formatINR(totalReceivedInterest))}
          </Text>
          <Text style={styles.earnedSeparator}> / </Text>
          <Text style={[styles.earnedTotal, maskStyle]}>
            {mask(formatINR(totalProjectedInterest))}
          </Text>
        </View>
      </View>
      <View style={styles.progressTrack} onLayout={onTrackLayout}>
        <View
          style={[
            styles.progressFill,
            { width: trackWidth > 0 ? trackWidth * ratio : 0 },
          ]}
        />
      </View>
    </View>
  );
}

function TabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: 'upcoming' | 'received';
  onTabChange: (t: 'upcoming' | 'received') => void;
}) {
  const [labelWidths, setLabelWidths] = useState<Record<string, number>>({});
  const tabs: { id: 'upcoming' | 'received'; label: string }[] = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'received', label: 'Received' },
  ];
  return (
    <View style={styles.tabBar}>
      {tabs.map((t) => {
        const active = activeTab === t.id;
        const indicatorWidth = (labelWidths[t.id] ?? 0) + 32;
        return (
          <TouchableOpacity
            key={t.id}
            style={styles.tab}
            onPress={() => onTabChange(t.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.tabLabel, active && styles.tabLabelActive]}
              onLayout={(e) =>
                setLabelWidths((w) => ({ ...w, [t.id]: e.nativeEvent.layout.width }))
              }
            >
              {t.label}
            </Text>
            {active && (
              <View style={styles.tabIndicatorAnchor}>
                <View style={[styles.tabIndicator, { width: indicatorWidth }]} />
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function FilterRow({
  tdsEnabled,
  onToggleTds,
}: {
  tdsEnabled: boolean;
  onToggleTds: (v: boolean) => void;
}) {
  return (
    <View style={styles.filterRow}>
      <HugeiconsIcon
        icon={FilterIcon}
        size={iconSizes.medium}
        color={colors.contentSecondary}
      />
      <View style={styles.filterRight}>
        <Text style={styles.tdsLabel}>TDS</Text>
        <Switch
          value={tdsEnabled}
          onValueChange={onToggleTds}
          trackColor={{
            false: colors.borderPrimary,
            true: colors.contentPositive,
          }}
          thumbColor={colors.contentPrimary}
          style={styles.toggle}
        />
      </View>
    </View>
  );
}

interface PayoutRowProps {
  issuer: string;
  bondId: string;
  date: string;
  kind: 'interest' | 'principal';
  amount: number;
  isLast: boolean;
}

function PayoutRow({
  issuer,
  bondId,
  date,
  kind,
  amount,
  isLast,
}: PayoutRowProps) {
  const { mask, maskStyle } = useHideValues();
  const bond = bondById[bondId];
  const maturity = bond ? maturityLabel(bond.maturityDate) : '';
  const subtitle = maturity ? `${issuer} ${maturity}` : issuer;
  const amountColor =
    kind === 'interest' ? colors.contentPositive : colors.contentPrimary;
  const amountPrefix = kind === 'interest' ? '+' : '';
  const typeLabel = kind === 'interest' ? 'Interest' : 'Principal';

  return (
    <>
      <View style={styles.payoutRow}>
        <CompanyAvatar name={issuer} />
        <View style={styles.payoutMiddle}>
          <Text style={styles.payoutDate} numberOfLines={1}>
            {formatPayoutDate(date)}
          </Text>
          <Text style={styles.payoutSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
        <View style={styles.payoutTrailing}>
          <Text
            style={[styles.payoutAmount, { color: amountColor }, maskStyle]}
            numberOfLines={1}
          >
            {mask(`${amountPrefix}${formatINR(amount)}`)}
          </Text>
          <Text style={styles.payoutType}>{typeLabel}</Text>
        </View>
      </View>
      {!isLast && <View style={styles.rowDivider} />}
    </>
  );
}

export default function PayoutScheduleScreen() {
  const [tab, setTab] = useState<'upcoming' | 'received'>('upcoming');
  const [tdsEnabled, setTdsEnabled] = useState(false);
  const { hidden } = useHideValues();
  const router = useRouter();

  const payouts = tab === 'upcoming' ? upcomingPayouts : receivedPayouts;
  const groups = groupPayoutsByMonth(payouts);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.dismiss()}
          style={styles.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            size={iconSizes.large}
            color={colors.contentPrimary}
          />
        </TouchableOpacity>
        <View style={styles.headerTextBlock}>
          <Text style={styles.headerTitle}>Payouts</Text>
          <Text style={styles.headerSubtitle}>{headerSubtitle()}</Text>
        </View>
      </View>

      {/* Interest Earned Card */}
      <View style={styles.cardWrapper}>
        <InterestEarnedCard />
      </View>

      {/* Tabs */}
      <TabBar activeTab={tab} onTabChange={setTab} />

      {/* Filter row */}
      <FilterRow tdsEnabled={tdsEnabled} onToggleTds={setTdsEnabled} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {groups.map((group) => (
          <View key={group.monthKey}>
            <View style={styles.monthHeader}>
              <Text style={styles.monthLabel}>
                {monthGroupLabel(group.monthKey)}
              </Text>
              <Text style={styles.monthTotal}>
                {hidden ? 'Total: ₹••••' : `Total: ${formatINR(group.total)}`}
              </Text>
            </View>

            {group.payouts.map((payout, idx) => (
              <PayoutRow
                key={payout.id}
                issuer={payout.issuer}
                bondId={payout.bondId}
                date={payout.date}
                kind={payout.kind}
                amount={payout.amount}
                isLast={idx === group.payouts.length - 1}
              />
            ))}
          </View>
        ))}

        {groups.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No {tab} payouts</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },

  // header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextBlock: {
    flex: 1,
    gap: 2,
  },
  headerTitle: {
    ...textStyles.headingSmall,
    color: colors.contentPrimary,
  },
  headerSubtitle: {
    ...textStyles.bodySmall,
    color: colors.contentSecondary,
  },

  // interest earned card
  cardWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  earnedCard: {
    backgroundColor: colors.backgroundSurfaceZ1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 16,
  },
  earnedCardContent: {
    gap: 4,
  },
  earnedEyebrow: {
    ...textStyles.headingEyebrow,
    color: colors.contentSecondary,
    textTransform: 'uppercase',
  },
  earnedAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  earnedAmount: {
    ...textStyles.displaySmall,
    color: colors.contentPrimary,
  },
  earnedSeparator: {
    ...textStyles.headingXSmall,
    color: colors.contentTertiary,
  },
  earnedTotal: {
    ...textStyles.headingXSmall,
    color: colors.contentTertiary,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderPrimary,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.contentPositive,
  },

  // tabs
  tabBar: {
    flexDirection: 'row',
    paddingLeft: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderPrimary,
  },
  tab: {
    paddingHorizontal: 16,
    height: 48,
    justifyContent: 'center',
    position: 'relative',
  },
  tabLabel: {
    ...textStyles.headingSmall,
    color: colors.contentSecondary,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: colors.contentPrimary,
  },
  tabIndicatorAnchor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  tabIndicator: {
    height: 3,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: colors.contentPrimary,
  },

  // filter row
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 4,
  },
  filterRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tdsLabel: {
    ...textStyles.bodySmall,
    color: colors.contentSecondary,
  },
  toggle: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },

  // scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // month group
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 4,
  },
  monthLabel: {
    ...textStyles.headingEyebrow,
    color: colors.contentSecondary,
    textTransform: 'uppercase',
  },
  monthTotal: {
    ...textStyles.bodySmall,
    color: colors.contentSecondary,
  },

  // payout row
  payoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
    minHeight: 56,
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.borderPrimary,
    marginLeft: 72, // 16 pad + 40 avatar + 16 gap
  },

  // avatar
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    ...textStyles.bodySmallHeavy,
    color: colors.contentPrimary,
    fontSize: 13,
  },

  // payout middle
  payoutMiddle: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  payoutDate: {
    ...textStyles.bodyBaseHeavy,
    color: colors.contentPrimary,
  },
  payoutSubtitle: {
    ...textStyles.bodySmall,
    color: colors.contentSecondary,
  },

  // payout trailing
  payoutTrailing: {
    width: 96,
    alignItems: 'flex-end',
    gap: 2,
    flexShrink: 0,
  },
  payoutAmount: {
    ...textStyles.bodyBaseHeavy,
    textAlign: 'right',
  },
  payoutType: {
    ...textStyles.bodySmall,
    color: colors.contentSecondary,
    textAlign: 'right',
  },

  // empty
  emptyState: {
    paddingTop: 80,
    alignItems: 'center',
  },
  emptyText: {
    ...textStyles.bodyBase,
    color: colors.contentSecondary,
  },
});
