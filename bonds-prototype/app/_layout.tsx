import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet, Platform, Text, useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HideValuesProvider } from '../hooks/useHideValues';
import { ScrollBottomProvider } from '../hooks/useScrollBottom';
import { colors, textStyles } from '../theme/tokens';

const isWeb = Platform.OS === 'web';

// Physical phone hardware colors — not DS tokens
const PHONE_CASE = '#1C1C1E';
const PHONE_BUTTON = '#2D2D2F';
const PHONE_ISLAND = '#000000';
const WEB_FRAME_BG = '#E8EAF0';
// Physical phone chrome font sizes — iOS system UI, no DS equivalents
const IOS_STATUS_BAR_FONT_SIZE = 15;
const IOS_STATUS_ICON_FONT_SIZE = 10;

// iPhone 14 logical dimensions
const SCREEN_W = 390;
const SCREEN_H = 844;
const BEZEL_H = 16;
const BEZEL_SIDE = 14;
const PHONE_W = SCREEN_W + BEZEL_SIDE * 2; // 418
const PHONE_H = SCREEN_H + BEZEL_H * 2;    // 876
const STATUS_BAR_H = 59;
const HOME_INDICATOR_H = 34;

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Sohne-Kraftig': require('../assets/fonts/Sohne-Kraftig.ttf'),
    'GrowwSans-Regular': require('../assets/fonts/GrowwSans-Regular.ttf'),
    'GrowwSans-Medium': require('../assets/fonts/GrowwSans-Medium.ttf'),
  });

  const appContent = (fontsLoaded || fontError) ? (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollBottomProvider>
      <HideValuesProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="bond/[id]" options={{ presentation: 'card' }} />
          <Stack.Screen name="payout-schedule" options={{ presentation: 'card' }} />
          <Stack.Screen name="matured-bonds" options={{ presentation: 'card' }} />
        </Stack>
        <StatusBar style="light" />
      </HideValuesProvider>
      </ScrollBottomProvider>
    </GestureHandlerRootView>
  ) : (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.backgroundPrimary }}>
      <ActivityIndicator color={colors.contentAccent} />
    </View>
  );

  if (!isWeb) {
    return appContent;
  }

  return (
    <SafeAreaProvider
      initialMetrics={{
        insets: { top: STATUS_BAR_H, right: 0, bottom: HOME_INDICATOR_H, left: 0 },
        frame: { width: SCREEN_W, height: SCREEN_H, x: 0, y: 0 },
      }}
    >
      <PhoneMockup>{appContent}</PhoneMockup>
    </SafeAreaProvider>
  );
}

function PhoneMockup({ children }: { children: React.ReactNode }) {
  const { height: winH, width: winW } = useWindowDimensions();

  const scaleH = (winH - 40) / PHONE_H;
  const scaleW = (winW - 60) / PHONE_W;
  const scale = Math.min(1, scaleH, scaleW);

  return (
    <View style={styles.webBg}>
      <View style={[styles.phoneOuter, { transform: [{ scale }] }]}>
        {/* Side buttons */}
        <View style={[styles.sideBtn, styles.silentSwitch]} />
        <View style={[styles.sideBtn, styles.volUp]} />
        <View style={[styles.sideBtn, styles.volDown]} />
        <View style={[styles.sideBtn, styles.powerBtn]} />

        {/* Screen */}
        <View style={styles.screen}>
          {/* Status bar */}
          <View style={styles.statusBar}>
            <View style={styles.dynamicIsland} />
            <Text style={styles.timeText}>9:41</Text>
            <View style={styles.statusRight}>
              <Text style={styles.statusIcon}>▲▲</Text>
              <Text style={styles.statusIcon}>WiFi</Text>
              <Text style={styles.statusIcon}>100%</Text>
            </View>
          </View>

          {/* App content */}
          <View style={{ flex: 1, overflow: 'hidden' }}>
            {children}
          </View>

          {/* Home indicator */}
          <View style={styles.homeIndicatorArea}>
            <View style={styles.homeIndicator} />
          </View>
        </View>
      </View>

      <Text style={styles.label}>Bonds Holdings · Prototype</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  webBg: {
    flex: 1,
    backgroundColor: WEB_FRAME_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneOuter: {
    width: PHONE_W,
    height: PHONE_H,
    backgroundColor: PHONE_CASE,
    borderRadius: 54,
    position: 'relative',
    shadowColor: PHONE_ISLAND,
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.45,
    shadowRadius: 48,
    elevation: 24,
  },
  // Side buttons (absolute, outside screen but inside the scaled frame)
  sideBtn: {
    position: 'absolute',
    backgroundColor: PHONE_BUTTON,
    borderRadius: 3,
  },
  silentSwitch: {
    left: -3,
    top: 120,
    width: 4,
    height: 28,
  },
  volUp: {
    left: -3,
    top: 168,
    width: 4,
    height: 60,
  },
  volDown: {
    left: -3,
    top: 240,
    width: 4,
    height: 60,
  },
  powerBtn: {
    right: -3,
    top: 180,
    width: 4,
    height: 88,
  },
  screen: {
    position: 'absolute',
    top: BEZEL_H,
    left: BEZEL_SIDE,
    width: SCREEN_W,
    height: SCREEN_H,
    backgroundColor: colors.backgroundPrimary,
    borderRadius: 44,
    overflow: 'hidden',
  },
  statusBar: {
    height: STATUS_BAR_H,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 10,
    paddingHorizontal: 24,
    position: 'relative',
  },
  dynamicIsland: {
    position: 'absolute',
    top: 12,
    alignSelf: 'center',
    left: (SCREEN_W - 120) / 2,
    width: 120,
    height: 37,
    backgroundColor: PHONE_ISLAND,
    borderRadius: 20,
  },
  timeText: {
    fontSize: IOS_STATUS_BAR_FONT_SIZE,
    fontWeight: '600',
    color: colors.contentPrimary,
    letterSpacing: -0.3,
  },
  statusRight: {
    flexDirection: 'row',
    gap: 4,
    marginLeft: 'auto',
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: IOS_STATUS_ICON_FONT_SIZE,
    color: colors.contentPrimary,
    fontWeight: '600',
  },
  homeIndicatorArea: {
    height: HOME_INDICATOR_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: PHONE_CASE,
    borderRadius: 3,
    opacity: 0.2,
  },
  label: {
    marginTop: 20,
    ...textStyles.bodySmallHeavy,
    color: colors.contentSecondary,
    letterSpacing: 0.5,
  },
});
