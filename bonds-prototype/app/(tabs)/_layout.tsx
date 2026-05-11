import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, textStyles } from '../../theme/tokens';

const TABS = [
  { name: 'stocks', label: 'Stocks', icon: '↗' },
  { name: 'mf', label: 'Mutual Funds', icon: '◉' },
  { name: 'fno', label: 'F&O', icon: '⊠' },
  { name: 'loans', label: 'Money', icon: '₹' },
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
            <Text style={[styles.tabIcon, isFocused && styles.tabIconActive]}>
              {tab.icon}
            </Text>
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
    backgroundColor: colors.backgroundPrimary,
    borderTopWidth: 1,
    borderTopColor: colors.borderPrimary,
    height: 72,
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: '100%',
  },
  tabIcon: {
    fontSize: 22,
    color: colors.contentSecondary,
    lineHeight: 26,
  },
  tabIconActive: {
    color: colors.contentAccentSecondary,
  },
  tabLabel: {
    ...textStyles.bodySmall,
    fontSize: 10,
    lineHeight: 12,
    color: colors.contentSecondary,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: colors.contentAccentSecondary,
  },
});
