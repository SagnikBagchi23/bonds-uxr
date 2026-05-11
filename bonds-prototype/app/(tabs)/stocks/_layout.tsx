import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../theme/tokens';

export default function StocksLayout() {
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="holdings" />
        <Stack.Screen name="explore" />
        <Stack.Screen name="positions" />
        <Stack.Screen name="orders" />
        <Stack.Screen name="sips" />
        <Stack.Screen name="watchlist" />
      </Stack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
});
