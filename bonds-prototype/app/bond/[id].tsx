import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { InformationCircleIcon } from '@hugeicons/core-free-icons';
import { colors, textStyles, iconSizes } from '../../theme/tokens';
import { useHideValues } from '../../hooks/useHideValues';
import { bonds } from '../../data/bonds';
import { bondFinancials, allPayouts } from '../../data/payouts';

function formatINR(value: number): string {
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  return `₹${value.toLocaleString('en-IN')}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const TOOLTIPS: Record<string, { title: string; body: string }> = {
  ytm: {
    title: 'Yield to Maturity (YTM)',
    body: 'YTM is the total return you earn if you hold the bond until it matures and all payments are made on time. It includes both the coupon interest and any difference between what you paid and the face value.',
  },
  coupon: {
    title: 'Coupon Rate',
    body: 'The coupon rate is the annual interest the bond issuer pays you, expressed as a percentage of the face value. For example, a 10% coupon on ₹1,000 face value pays ₹100 per year.',
  },
  faceValue: {
    title: 'Face Value',
    body: 'Face value (also called par value) is the amount the issuer promises to repay when the bond matures. This is different from what you paid for the bond (the market price).',
  },
};

function InfoTooltip({ id }: { id: string }) {
  const [visible, setVisible] = useState(false);
  const tip = TOOLTIPS[id];

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.infoBtn} activeOpacity={0.7}>
        <HugeiconsIcon icon={InformationCircleIcon} size={iconSizes.small} color={colors.contentDisabled} />
      </TouchableOpacity>
      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setVisible(false)} activeOpacity={1}>
          <View style={styles.tooltipCard}>
            <Text style={styles.tooltipTitle}>{tip.title}</Text>
            <Text style={styles.tooltipBody}>{tip.body}</Text>
            <TouchableOpacity
              onPress={() => setVisible(false)}
              style={styles.tooltipCloseBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.tooltipCloseLabel}>Got it</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

function DetailRow({ label, value, tooltipId, valueColor }: {
  label: string;
  value: string;
  tooltipId?: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailLabelRow}>
        <Text style={styles.detailLabel}>{label}</Text>
        {tooltipId && <InfoTooltip id={tooltipId} />}
      </View>
      <Text style={[styles.detailValue, valueColor ? { color: valueColor } : {}]}>{value}</Text>
    </View>
  );
}

export default function BondDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { mask } = useHideValues();

  const bond = bonds.find((b) => b.id === id);
  if (!bond) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ ...textStyles.bodyBase, color: colors.contentSecondary }}>Bond not found</Text>
      </View>
    );
  }

  const fin = bondFinancials[bond.id];
  const bondPayouts = allPayouts.filter((p) => p.bondId === bond.id).slice(0, 6);
  const daysToMaturity = Math.max(
    0,
    Math.ceil((new Date(bond.maturityDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{bond.issuer}</Text>
        <View style={styles.backBtn} />
      </View>
      <View style={styles.headerDivider} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Value summary */}
        <View style={styles.valueSummary}>
          <Text style={styles.valueSummaryLabel}>Current Value</Text>
          <Text style={styles.valueSummaryAmount}>{mask(formatINR(fin.totalValue))}</Text>
          <View style={styles.valueBreakdown}>
            <View style={styles.valueItem}>
              <Text style={styles.valueItemLabel}>Invested</Text>
              <Text style={styles.valueItemAmount}>{mask(formatINR(fin.invested))}</Text>
            </View>
            <Text style={styles.valuePlus}>+</Text>
            <View style={styles.valueItem}>
              <Text style={styles.valueItemLabel}>Interest earned</Text>
              <Text style={[styles.valueItemAmount, { color: colors.contentPositive }]}>
                {mask(formatINR(fin.interestEarned))}
              </Text>
            </View>
          </View>
        </View>

        {/* Bond details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bond Details</Text>
          <DetailRow label="ISIN" value={bond.isin} />
          <DetailRow label="Rating" value={bond.rating} />
          <DetailRow
            label="Coupon Rate"
            value={`${bond.couponRate}% p.a.`}
            tooltipId="coupon"
          />
          <DetailRow
            label="Yield to Maturity"
            value={`${bond.ytm}%`}
            tooltipId="ytm"
          />
          <DetailRow
            label="Face Value"
            value={`${formatINR(bond.faceValue)} per unit`}
            tooltipId="faceValue"
          />
          <DetailRow label="Units held" value={`${bond.units}`} />
          <DetailRow label="Market Price" value={mask(formatINR(fin.marketPrice))} />
          <DetailRow label="Coupon frequency" value={
            bond.couponFrequency === 'monthly' ? 'Monthly'
            : bond.couponFrequency === 'semi-annual' ? 'Semi-Annual'
            : 'Annual'
          } />
          <DetailRow label="Maturity Date" value={formatDate(bond.maturityDate)} />
          <DetailRow label="Days to Maturity" value={`${daysToMaturity} days`} />
          {bond.payoutType === 'staggered' && (
            <DetailRow
              label="Principal returned"
              value={mask(formatINR(bond.principalReturned ?? 0))}
              valueColor={colors.contentWarning}
            />
          )}
        </View>

        {/* Payout schedule preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Payout Schedule</Text>
            <TouchableOpacity onPress={() => router.push('/payout-schedule')} activeOpacity={0.7}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          {bondPayouts.map((p) => (
            <View key={p.id} style={styles.payoutRow}>
              <View style={styles.payoutLeft}>
                <View style={[
                  styles.kindDot,
                  { backgroundColor: p.kind === 'interest' ? colors.backgroundAccentSubtle : colors.backgroundWarningSubtle }
                ]} />
                <View>
                  <Text style={styles.payoutKind}>
                    {p.kind === 'interest' ? 'Interest' : 'Principal'}
                  </Text>
                  <Text style={styles.payoutDate}>{formatDate(p.date)}</Text>
                </View>
              </View>
              <View style={styles.payoutRight}>
                <Text style={[styles.payoutAmount, p.kind === 'principal' && { color: colors.contentWarning }]}>
                  {mask(formatINR(p.amount))}
                </Text>
                {p.received && (
                  <Text style={styles.receivedLabel}>Received</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    alignItems: 'flex-start',
  },
  backIcon: {
    fontSize: iconSizes.medium,
    color: colors.contentPrimary,
  },
  headerTitle: {
    ...textStyles.headingSmall,
    color: colors.contentPrimary,
    flex: 1,
    textAlign: 'center',
  },
  headerDivider: {
    height: 1,
    backgroundColor: colors.borderPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 20,
  },
  valueSummary: {
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  valueSummaryLabel: {
    ...textStyles.bodySmall,
    color: colors.contentSecondary,
  },
  valueSummaryAmount: {
    ...textStyles.displaySmall,
    color: colors.contentPrimary,
  },
  valueBreakdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  valueItem: {
    flex: 1,
    gap: 2,
  },
  valueItemLabel: {
    ...textStyles.bodySmall,
    color: colors.contentSecondary,
  },
  valueItemAmount: {
    ...textStyles.bodyBaseHeavy,
    color: colors.contentPrimary,
  },
  valuePlus: {
    ...textStyles.bodyBase,
    color: colors.contentDisabled,
  },
  section: {
    gap: 0,
  },
  sectionTitle: {
    ...textStyles.bodySmallHeavy,
    color: colors.contentSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  seeAll: {
    ...textStyles.bodySmall,
    color: colors.contentAccent,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderPrimary,
  },
  detailLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailLabel: {
    ...textStyles.bodyBase,
    color: colors.contentSecondary,
  },
  detailValue: {
    ...textStyles.bodyBaseHeavy,
    color: colors.contentPrimary,
  },
  infoBtn: {
    padding: 2,
  },
  payoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderPrimary,
  },
  payoutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  kindDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  payoutKind: {
    ...textStyles.bodyBase,
    color: colors.contentPrimary,
  },
  payoutDate: {
    ...textStyles.bodySmall,
    color: colors.contentSecondary,
  },
  payoutRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  payoutAmount: {
    ...textStyles.bodyBaseHeavy,
    color: colors.contentPositive,
  },
  receivedLabel: {
    ...textStyles.bodySmall,
    color: colors.contentSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  tooltipCard: {
    backgroundColor: colors.backgroundPrimary,
    borderRadius: 16,
    padding: 20,
    gap: 12,
    width: '100%',
  },
  tooltipTitle: {
    ...textStyles.headingSmall,
    color: colors.contentPrimary,
  },
  tooltipBody: {
    ...textStyles.bodyBase,
    color: colors.contentSecondary,
    lineHeight: 22,
  },
  tooltipCloseBtn: {
    backgroundColor: colors.contentAccent,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  tooltipCloseLabel: {
    ...textStyles.bodyBaseHeavy,
    color: colors.contentOnColour,
  },
});
