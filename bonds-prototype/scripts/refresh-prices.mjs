/**
 * Fetches latest NSE prices via yahoo-finance2 and patches data/stocks.ts.
 * Run with: node scripts/refresh-prices.mjs
 */

import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STOCKS_FILE = join(__dirname, '../data/stocks.ts');

const src = readFileSync(STOCKS_FILE, 'utf8');
const tickerMatches = [...src.matchAll(/ticker:\s*'([^']+)'/g)];
const tickers = tickerMatches.map(m => m[1]);

if (tickers.length === 0) {
  console.error('No tickers found in data/stocks.ts');
  process.exit(1);
}

console.log(`Fetching prices for ${tickers.length} stocks…`);

const symbols = tickers.map(t => `${t}.NS`);
const results = await yahooFinance.quote(symbols, {}, { validateResult: false });
const quotes = Array.isArray(results) ? results : [results];

const priceMap = {};
const missing = [];

for (const ticker of tickers) {
  const quote = quotes.find(q => q?.symbol === `${ticker}.NS`);
  const current = quote?.regularMarketPrice;
  const prev = quote?.regularMarketPreviousClose;
  if (!current || !prev) {
    missing.push(ticker);
    continue;
  }
  priceMap[ticker] = {
    currentPrice: Math.round(current * 100) / 100,
    prevDayPrice: Math.round(prev * 100) / 100,
  };
}

if (missing.length > 0) {
  console.warn(`⚠ No data for: ${missing.join(', ')} — keeping existing values`);
  if (missing.includes('TATAMOTORS')) {
    console.warn('  TATAMOTORS: Yahoo Finance API does not return this ticker. Update manually from nseindia.com or business-standard.com.');
  }
}

let updated = src;
for (const [ticker, { currentPrice, prevDayPrice }] of Object.entries(priceMap)) {
  updated = updated.replace(
    new RegExp(
      `(\\{[^}]*ticker:\\s*'${ticker}'[^}]*currentPrice:\\s*)([\\d.]+)([^}]*prevDayPrice:\\s*)([\\d.]+)`,
      'g'
    ),
    `$1${currentPrice}$3${prevDayPrice}`
  );
}

writeFileSync(STOCKS_FILE, updated, 'utf8');

console.log('\nUpdated prices:');
for (const [ticker, { currentPrice, prevDayPrice }] of Object.entries(priceMap)) {
  const change = ((currentPrice - prevDayPrice) / prevDayPrice * 100).toFixed(2);
  const sign = Number(change) >= 0 ? '+' : '';
  console.log(`  ${ticker.padEnd(12)} ₹${currentPrice}  (1D: ${sign}${change}%)`);
}
console.log(`\n✓ data/stocks.ts updated`);
