import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { useRef, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Activity01Icon,
  PieChart09Icon,
  LoyaltyCardIcon,
  Money03Icon,
} from '@hugeicons/core-free-icons';
import { colors, iconSizes } from '../../theme/tokens';
import { useScrollBottom } from '../../hooks/useScrollBottom';

// Emil's strong ease-out: cubic-bezier(0.23, 1, 0.32, 1)
const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);
const DURATION = 150;

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
  const { hasContentBelow } = useScrollBottom();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: hasContentBelow ? 1 : 0,
      duration: DURATION,
      easing: EASE_OUT,
      useNativeDriver: false,
    }).start();
  }, [hasContentBelow]);

  const bg = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.backgroundPrimary, colors.backgroundSurfaceZ1],
  });

  const borderColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', colors.borderPrimary],
  });

  return (
    <Animated.View style={[styles.tabBar, { backgroundColor: bg, borderTopColor: borderColor }]}>
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 64,
    alignItems: 'center',
    borderTopWidth: 1,
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
