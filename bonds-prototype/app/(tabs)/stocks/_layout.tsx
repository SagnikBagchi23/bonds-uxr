import { Stack, useRouter, usePathname } from 'expo-router';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, textStyles } from '../../../theme/tokens';

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
  const effectiveIndex = activeIndex >= 0 ? activeIndex : 1; // default to Holdings

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundPrimary }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.backgroundPrimary }}>
        {/* App header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Groww</Text>
        </View>

        {/* Sub-tab bar */}
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
        <View style={styles.divider} />
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    ...textStyles.headingBase,
    color: colors.contentAccent,
  },
  subTabBar: {
    backgroundColor: colors.backgroundPrimary,
  },
  subTabContent: {
    paddingHorizontal: 16,
    gap: 0,
  },
  subTab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    position: 'relative',
  },
  subTabLabel: {
    ...textStyles.bodyBase,
    color: colors.contentSecondary,
  },
  subTabLabelActive: {
    ...textStyles.bodyBaseHeavy,
    color: colors.contentPrimary,
  },
  subTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 14,
    right: 14,
    height: 2,
    backgroundColor: colors.contentPrimary,
    borderRadius: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderPrimary,
  },
});
