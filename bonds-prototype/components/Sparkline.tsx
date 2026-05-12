import { useEffect } from 'react';
import Svg, { Polyline } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing } from 'react-native-reanimated';
import { colors } from '../theme/tokens';

const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);

interface SparklineProps {
  data: number[];
  positive: boolean;
  width?: number;
  height?: number;
}

export function Sparkline({ data, positive, width = 80, height = 28 }: SparklineProps) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 1.5;

  const pointArr = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (width - pad * 2) + pad;
    const y = height - pad - ((v - min) / range) * (height - pad * 2);
    return { x, y };
  });

  let totalLength = 0;
  for (let i = 1; i < pointArr.length; i++) {
    const dx = pointArr[i].x - pointArr[i - 1].x;
    const dy = pointArr[i].y - pointArr[i - 1].y;
    totalLength += Math.sqrt(dx * dx + dy * dy);
  }

  const points = pointArr.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
  const color = positive ? colors.contentPositive : colors.contentNegative;

  const dashOffset = useSharedValue(totalLength);

  useEffect(() => {
    dashOffset.value = withTiming(0, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: dashOffset.value,
  }));

  return (
    <Svg width={width} height={height} style={{ alignSelf: 'center' }}>
      <AnimatedPolyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={totalLength}
        animatedProps={animatedProps}
      />
    </Svg>
  );
}
