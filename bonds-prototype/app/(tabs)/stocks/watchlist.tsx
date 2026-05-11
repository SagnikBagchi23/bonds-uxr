import { View, Text, StyleSheet } from 'react-native';
import { colors, textStyles } from '../../../theme/tokens';

export default function WatchlistPlaceholder() {
  return (
    <View style={styles.c}>
      <Text style={styles.t}>Watchlist</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.backgroundPrimary },
  t: { ...textStyles.headingBase, color: colors.contentSecondary },
});
