import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Activity01Icon,
  PieChart09Icon,
  LoyaltyCardIcon,
  Money03Icon,
} from '@hugeicons/core-free-icons';
import { colors, textStyles, iconSizes } from '../../theme/tokens';

const TABS = [
  { name: 'stocks', label: 'Stocks', icon: Activity01Icon },
  { name: 'mf', label: 'Mutual Funds', icon: PieChart09Icon },
  { name: 'fno', label: 'F&O', icon: LoyaltyCardIcon },
  { name: 'loans', label: 'Loans', icon: Money03Icon },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="stocks" />
      <Tabs.Screen name="mf" />
      <Tabs.Screen name="fno" />
      <Tabs.Screen name="loans" />
    </Tabs>
  );
}

function CustomTabBar({ state, navigation }: any) {
  return (
    <View style={styles.tabBar}>
      {TABS.map((tab, index) => {
        const isFocused = state.index === index;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => navigation.navigate(tab.name)}
            activeOpacity={0.8}
          >
            <HugeiconsIcon
              icon={tab.icon}
              size={iconSizes.large}
              color={isFocused ? colors.contentAccentSecondary : colors.contentSecondary}
            />
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 72,
    alignItems: 'center',
    backgroundColor: colors.backgroundPrimary,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: '100%',
  },
  tabLabel: {
    fontFamily: 'Sohne-Kraftig',
    fontSize: 10,
    color: colors.contentSecondary,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: colors.contentAccentSecondary,
  },
});
