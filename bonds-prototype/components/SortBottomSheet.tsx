import { useEffect, useReducer, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Pressable,
  Easing,
} from 'react-native';
import { colors, textStyles } from '../theme/tokens';

export type SortField = 'totalValue' | 'interest' | 'mktPrice' | 'name';
export type SortDir = 'high' | 'low' | 'az' | 'za';
export interface SortState { field: SortField; dir: SortDir }

interface SortBottomSheetProps {
  visible: boolean;
  initial: SortState;
  onApply: (state: SortState) => void;
  onClose: () => void;
}

const EASE_OUT = Easing.bezier(0.32, 0.72, 0, 1);

const SORT_OPTIONS: { id: SortField; label: string }[] = [
  { id: 'totalValue', label: 'Total value' },
  { id: 'interest', label: 'Interest' },
  { id: 'mktPrice', label: 'Mkt price' },
  { id: 'name', label: 'Name' },
];

const NUM_DIRS: { id: SortDir; label: string }[] = [
  { id: 'high', label: '↓  High to low' },
  { id: 'low', label: '↑  Low to high' },
];

const NAME_DIRS: { id: SortDir; label: string }[] = [
  { id: 'az', label: 'A – Z' },
  { id: 'za', label: 'Z – A' },
];

function defaultDir(field: SortField): SortDir {
  return field === 'name' ? 'az' : 'high';
}

export function SortBottomSheet({ visible, initial, onApply, onClose }: SortBottomSheetProps) {
  const slideAnim = useRef(new Animated.Value(400)).current;
  const bgOpacity = useRef(new Animated.Value(0)).current;

  // isActive stays true while visible OR while animating out, so the sheet
  // is never rendered when fully dismissed (avoids the visible-at-bottom flash)
  const [isActive, setIsActive] = useState(false);

  // Track pending selection inside the sheet (local state via ref + force-update)
  const selectionRef = useRef<SortState>(initial);
  const [, forceUpdate] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    if (visible) {
      setIsActive(true);
      selectionRef.current = initial;
      forceUpdate();
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 380, easing: EASE_OUT, useNativeDriver: true }),
        Animated.timing(bgOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 400, duration: 260, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
        Animated.timing(bgOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(({ finished }) => {
        if (finished) setIsActive(false);
      });
    }
  }, [visible]);

  const setField = (field: SortField) => {
    const cur = selectionRef.current;
    if (cur.field === field) return;
    selectionRef.current = { field, dir: defaultDir(field) };
    forceUpdate();
  };

  const setDir = (dir: SortDir) => {
    selectionRef.current = { ...selectionRef.current, dir };
    forceUpdate();
  };

  const { field: selField, dir: selDir } = selectionRef.current;

  if (!isActive) return null;

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: bgOpacity }]} pointerEvents={visible ? 'auto' : 'none'}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        {/* Title */}
        <View style={styles.titleFrame}>
          <Text style={styles.title}>Sort by</Text>
        </View>

        {/* Options */}
        {SORT_OPTIONS.map((opt, idx) => {
          const isSelected = selField === opt.id;
          const dirs = opt.id === 'name' ? NAME_DIRS : NUM_DIRS;
          const showDivider = idx < SORT_OPTIONS.length - 1;
          return (
            <View key={opt.id}>
              <TouchableOpacity activeOpacity={0.7} onPress={() => setField(opt.id)}>
                <View style={styles.row}>
                  {/* Radio */}
                  <View style={[styles.radio, isSelected && styles.radioSelected]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.rowLabel}>{opt.label}</Text>
                </View>

                {/* Sub-options pills */}
                {isSelected && (
                  <View style={styles.pillRow}>
                    {dirs.map((d) => {
                      const active = selDir === d.id;
                      return (
                        <TouchableOpacity
                          key={d.id}
                          activeOpacity={0.7}
                          onPress={() => setDir(d.id)}
                          style={[styles.pill, active && styles.pillActive]}
                        >
                          <Text style={[styles.pillLabel, active && styles.pillLabelActive]}>
                            {d.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </TouchableOpacity>

              {showDivider && <View style={styles.divider} />}
            </View>
          );
        })}

        {/* Apply */}
        <View style={styles.applyContainer}>
          <TouchableOpacity
            style={styles.applyBtn}
            activeOpacity={0.85}
            onPress={() => onApply(selectionRef.current)}
          >
            <Text style={styles.applyLabel}>Apply</Text>
          </TouchableOpacity>
        </View>

        {/* Home indicator */}
        <View style={styles.homeIndicatorArea}>
          <View style={styles.homeIndicator} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.backgroundSurfaceZ1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  titleFrame: {
    paddingTop: 20,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  title: {
    ...textStyles.headingBase,
    color: colors.contentPrimary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    minHeight: 56,
    gap: 16,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.contentSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.contentAccent,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.contentAccent,
  },
  rowLabel: {
    ...textStyles.bodyBaseHeavy,
    color: colors.contentPrimary,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 12,
    paddingLeft: 52,
    paddingBottom: 12,
    paddingTop: 4,
  },
  pill: {
    height: 32,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    backgroundColor: colors.backgroundSurfaceZ1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: colors.backgroundTertiary,
    borderColor: colors.contentPrimary,
  },
  pillLabel: {
    ...textStyles.bodySmallHeavy,
    color: colors.contentSecondary,
  },
  pillLabelActive: {
    color: colors.contentPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderPrimary,
    marginLeft: 52,
  },
  applyContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
  },
  applyBtn: {
    height: 48,
    backgroundColor: colors.contentAccent,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyLabel: {
    ...textStyles.bodyLargeHeavy,
    color: colors.contentOnColour,
  },
  homeIndicatorArea: {
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIndicator: {
    width: 108,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.contentSecondary,
  },
});
