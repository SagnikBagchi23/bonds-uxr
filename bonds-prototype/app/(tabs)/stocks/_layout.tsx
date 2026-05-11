import { Stack, useRouter, usePathname } from 'expo-router';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Search01Icon, QrCodeIcon } from '@hugeicons/core-free-icons';
import { colors, textStyles, iconSizes } from '../../../theme/tokens';

const SUB_TABS = [
  { label: 'Explore', path: '/(tabs)/stocks/explore' },
  { label: 'Holdings', path: '/(tabs)/stocks/holdings' },
  { label: 'Positions', path: '/(tabs)/stocks/positions' },
  { label: 'Orders', path: '/(tabs)/stocks/orders' },
  { label: 'SIPs', path: '/(tabs)/stocks/sips' },
  { label: 'Watchlist', path: '/(tabs)/stocks/watchlist' },
];

export default function StocksLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const activeIndex = SUB_TABS.findIndex((t) => pathname.includes(t.label.toLowerCase()));
  const effectiveIndex = activeIndex >= 0 ? activeIndex : 1;

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundPrimary }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.backgroundPrimary }}>
        {/* App bar */}
        <View style={styles.appBar}>
          {/* Leading: Groww logo placeholder */}
          <View style={styles.logoContainer}>
            <View style={styles.logoMark} />
          </View>

          <Text style={styles.appBarTitle}>Stocks</Text>

          {/* Trailing: search, QR, avatar */}
          <View style={styles.trailingIcons}>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
              <HugeiconsIcon icon={Search01Icon} size={iconSizes.medium} color={colors.contentPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
              <HugeiconsIcon icon={QrCodeIcon} size={iconSizes.medium} color={colors.contentPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarBtn} activeOpacity={0.7}>
              <Text style={styles.avatarInitial}>A</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sub-tab bar */}
        <View style={styles.dividerLine} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.subTabBar}
          contentContainerStyle={styles.subTabContent}
        >
          {SUB_TABS.map((tab, i) => {
            const isActive = i === effectiveIndex;
            return (
              <TouchableOpacity
                key={tab.label}
                style={styles.subTab}
                onPress={() => {
                  if (tab.label === 'Holdings') {
                    router.navigate('/(tabs)/stocks/holdings');
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.subTabLabel, isActive && styles.subTabLabelActive]}>
                  {tab.label}
                </Text>
                {isActive && <View style={styles.subTabIndicator} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={styles.dividerLine} />
      </SafeAreaView>

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="holdings" />
        <Stack.Screen name="explore" />
        <Stack.Screen name="positions" />
        <Stack.Screen name="orders" />
        <Stack.Screen name="sips" />
        <Stack.Screen name="watchlist" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 12,
    backgroundColor: colors.backgroundPrimary,
  },
  logoContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.contentAccent,
    opacity: 0.9,
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
  iconText: {
    fontSize: iconSizes.large,
    color: colors.contentPrimary,
  },
  avatarBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  avatarInitial: {
    ...textStyles.bodySmallHeavy,
    color: colors.contentSecondary,
  },
  dividerLine: {
    height: 1,
    backgroundColor: colors.borderPrimary,
  },
  subTabBar: {
    backgroundColor: colors.backgroundPrimary,
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
});
