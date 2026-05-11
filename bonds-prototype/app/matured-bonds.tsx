import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, textStyles, iconSizes } from '../theme/tokens';
import { useHideValues } from '../hooks/useHideValues';
import { maturedBonds } from '../data/bonds';
import { bondFinancials } from '../data/payouts';

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

export default function MaturedBondsScreen() {
  const { mask } = useHideValues();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Matured Bonds</Text>
        <View style={styles.backBtn} />
      </View>
      <View style={styles.divider} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {maturedBonds.map((bond) => {
          const fin = bondFinancials[bond.id];
          return (
            <View key={bond.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.issuerName}>{bond.issuer}</Text>
                <View style={styles.maturedBadge}>
                  <Text style={styles.maturedBadgeText}>Matured</Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>{bond.isin}</Text>
                <Text style={styles.metaDot}>·</Text>
                <Text style={styles.metaText}>Matured {formatDate(bond.maturityDate)}</Text>
              </View>

              <View style={styles.dividerLight} />

              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Invested</Text>
                  <Text style={styles.statValue}>{mask(formatINR(fin.invested))}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Interest earned</Text>
                  <Text style={[styles.statValue, { color: colors.contentPositive }]}>
                    {mask(formatINR(fin.interestEarned))}
                  </Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Coupon rate</Text>
                  <Text style={styles.statValue}>{bond.couponRate}%</Text>
                </View>
              </View>
            </View>
          );
        })}
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
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  issuerName: {
    ...textStyles.bodyBaseHeavy,
    color: colors.contentPrimary,
  },
  maturedBadge: {
    backgroundColor: colors.backgroundTertiary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  maturedBadgeText: {
    ...textStyles.bodySmall,
    color: colors.contentSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    ...textStyles.bodySmall,
    color: colors.contentSecondary,
  },
  metaDot: {
    ...textStyles.bodySmall,
    color: colors.contentDisabled,
  },
  dividerLight: {
    height: 1,
    backgroundColor: colors.borderPrimary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  stat: {
    flex: 1,
    gap: 4,
  },
  statLabel: {
    ...textStyles.bodySmall,
    color: colors.contentSecondary,
  },
  statValue: {
    ...textStyles.bodyBaseHeavy,
    color: colors.contentPrimary,
  },
});
