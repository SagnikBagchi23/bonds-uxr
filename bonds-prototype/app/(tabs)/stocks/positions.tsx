import { View, Text, StyleSheet } from 'react-native';
import { colors, textStyles } from '../../../theme/tokens';

function Placeholder({ label }: { label: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

export function PositionsScreen() { return <Placeholder label="Positions" />; }
export function OrdersScreen() { return <Placeholder label="Orders" />; }
export function SIPsScreen() { return <Placeholder label="SIPs" />; }
export function WatchlistScreen() { return <Placeholder label="Watchlist" />; }

export default Placeholder;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.backgroundPrimary },
  text: { ...textStyles.headingBase, color: colors.contentSecondary },
});
