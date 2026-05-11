import { View, Text, StyleSheet } from 'react-native';
import { colors, textStyles } from '../../../theme/tokens';

export default function ExplorePlaceholder() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Explore</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.backgroundPrimary },
  text: { ...textStyles.headingBase, color: colors.contentSecondary },
});
