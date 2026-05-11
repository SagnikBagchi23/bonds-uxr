import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, textStyles } from '../theme/tokens';

interface SegmentedToggleProps {
  options: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function SegmentedToggle({ options, selectedIndex, onSelect }: SegmentedToggleProps) {
  return (
    <View style={styles.container}>
      {options.map((option, i) => (
        <TouchableOpacity
          key={option}
          style={[styles.tab, i === selectedIndex && styles.tabActive]}
          onPress={() => onSelect(i)}
          activeOpacity={0.7}
        >
          <Text style={[styles.label, i === selectedIndex && styles.labelActive]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 4,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: colors.backgroundTertiary,
  },
  label: {
    ...textStyles.bodyBase,
    color: colors.contentSecondary,
  },
  labelActive: {
    ...textStyles.bodyBaseHeavy,
    color: colors.contentPrimary,
  },
});
