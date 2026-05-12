import Svg, { Polyline } from 'react-native-svg';
import { colors } from '../theme/tokens';

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

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * (width - pad * 2) + pad;
      const y = height - pad - ((v - min) / range) * (height - pad * 2);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  const color = positive ? colors.contentPositive : colors.contentNegative;

  return (
    <Svg width={width} height={height}>
      <Polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
