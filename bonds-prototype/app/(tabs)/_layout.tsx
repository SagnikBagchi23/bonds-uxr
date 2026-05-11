import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, textStyles } from '../../theme/tokens';

const TABS = [
  { name: 'stocks', label: 'Stocks', active: true },
  { name: 'fno', label: 'F&O', active: false },
  { name: 'mf', label: 'Mutual Funds', active: false },
  { name: 'loans', label: 'Loans', active: false },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="stocks" />
      <Tabs.Screen name="fno" />
      <Tabs.Screen name="mf" />
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
            activeOpacity={0.7}
          >
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
              {tab.label}
            </Text>
            {isFocused && <View style={styles.tabIndicator} />}
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
    paddingBottom: 28,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  tabLabel: {
    ...textStyles.bodySmall,
    color: colors.contentSecondary,
  },
  tabLabelActive: {
    ...textStyles.bodySmallHeavy,
    color: colors.contentAccent,
  },
  tabIndicator: {
    position: 'absolute',
    top: -8,
    width: 32,
    height: 2,
    backgroundColor: colors.contentAccent,
    borderRadius: 1,
  },
});
