import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { HideValuesProvider } from '../hooks/useHideValues';
import { colors } from '../theme/tokens';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Sohne-Kraftig': require('../assets/fonts/Sohne-Kraftig.otf'),
    'GrowwSans-Regular': require('../assets/fonts/GrowwSans-Regular.otf'),
    'GrowwSans-Medium': require('../assets/fonts/GrowwSans-Medium.otf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.backgroundPrimary }}>
        <ActivityIndicator color={colors.contentAccent} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HideValuesProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="bond/[id]" options={{ presentation: 'card' }} />
          <Stack.Screen name="payout-schedule" options={{ presentation: 'card' }} />
          <Stack.Screen name="matured-bonds" options={{ presentation: 'card' }} />
        </Stack>
        <StatusBar style="dark" />
      </HideValuesProvider>
    </GestureHandlerRootView>
  );
}
