import { useState, useEffect } from 'react';
import { sparklineData, sparklineIsPositive } from '../data/sparklines';

// Deterministic pseudo-random from ticker + index, so each stock starts visually distinct.
function seededRand(ticker: string, i: number): number {
  const x = Math.sin((ticker.charCodeAt(i % ticker.length) + 1) * (i + 1) * 9301) * 49297;
  return x - Math.floor(x);
}

export function useLiveSparkline(ticker: string): number[] {
  const base = sparklineData[ticker] ?? [];
  const positive = sparklineIsPositive(ticker);

  const [data, setData] = useState<number[]>(() => {
    if (base.length === 0) return [];
    // Perturb the static baseline so each stock looks distinct at first render.
    return base.map((v, i) => {
      const noise = (seededRand(ticker, i) - 0.5) * 0.1;
      return Math.max(0.05, Math.min(0.95, v + noise));
    });
  });

  useEffect(() => {
    if (base.length === 0) return;

    // Positive stocks tick slightly upward on average, negative slightly downward.
    const trend = positive ? 0.08 : -0.08;
    // Each stock has a unique volatility so the charts look different.
    const amplitude = 0.022 + seededRand(ticker, ticker.length + 3) * 0.028;

    const id = setInterval(() => {
      setData(prev => {
        const last = prev[prev.length - 1] ?? 0.5;
        const delta = amplitude * 2 * (Math.random() - 0.5 + trend);
        const next = Math.max(0.05, Math.min(0.95, last + delta));
        // Slide the window: drop oldest, append newest.
        return [...prev.slice(1), next];
      });
    }, 1000);

    return () => clearInterval(id);
  }, [ticker]);

  return data;
}
