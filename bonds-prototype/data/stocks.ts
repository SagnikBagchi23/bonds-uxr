export interface Stock {
  id: string;
  name: string;
  ticker: string;
  exchange: 'NSE' | 'BSE';
  units: number;
  avgPrice: number;
  currentPrice: number;
  prevDayPrice: number;
}

export interface StockFinancials {
  stockId: string;
  invested: number;
  currentValue: number;
  pnl: number;
  pnlPct: number;
  oneDayPnl: number;
  oneDayPnlPct: number;
}

export const stocks: Stock[] = [
  { id: 'GROWW',      name: 'Groww',                 ticker: 'GROWW',      exchange: 'NSE', units: 3215, avgPrice: 110,  currentPrice: 186.64, prevDayPrice: 193.52 },
  { id: 'RELIANCE',   name: 'Reliance Industries',   ticker: 'RELIANCE',   exchange: 'NSE', units: 30,   avgPrice: 1000, currentPrice: 1382,   prevDayPrice: 1388.2 },
  { id: 'TCS',        name: 'Tata Consultancy Svcs', ticker: 'TCS',        exchange: 'NSE', units: 20,   avgPrice: 1800, currentPrice: 2290,   prevDayPrice: 2392.9 },
  { id: 'HDFCBANK',   name: 'HDFC Bank',             ticker: 'HDFCBANK',   exchange: 'NSE', units: 595,  avgPrice: 600,  currentPrice: 756.05, prevDayPrice: 763.65 },
  { id: 'INFY',       name: 'Infosys',               ticker: 'INFY',       exchange: 'NSE', units: 40,   avgPrice: 900,  currentPrice: 1131.3, prevDayPrice: 1177   },
  { id: 'ICICIBANK',  name: 'ICICI Bank',            ticker: 'ICICIBANK',  exchange: 'NSE', units: 120,  avgPrice: 800,  currentPrice: 1246.1, prevDayPrice: 1266.4 },
  { id: 'BHARTIARTL', name: 'Bharti Airtel',         ticker: 'BHARTIARTL', exchange: 'NSE', units: 80,   avgPrice: 800,  currentPrice: 1770.4, prevDayPrice: 1759.8 },
  { id: 'BAJFINANCE', name: 'Bajaj Finance',         ticker: 'BAJFINANCE', exchange: 'NSE', units: 10,   avgPrice: 650,  currentPrice: 917.55, prevDayPrice: 936.05 },
  { id: 'LT',         name: 'Larsen & Toubro',       ticker: 'LT',         exchange: 'NSE', units: 20,   avgPrice: 2500, currentPrice: 3897.8, prevDayPrice: 3940.2 },
  { id: 'SBIN',       name: 'State Bank of India',   ticker: 'SBIN',       exchange: 'NSE', units: 256,  avgPrice: 700,  currentPrice: 976,    prevDayPrice: 973.6  },
  { id: 'WIPRO',      name: 'Wipro',                 ticker: 'WIPRO',      exchange: 'NSE', units: 80,   avgPrice: 250,  currentPrice: 191.24, prevDayPrice: 196.68 },
  { id: 'ASIANPAINT', name: 'Asian Paints',          ticker: 'ASIANPAINT', exchange: 'NSE', units: 20,   avgPrice: 2800, currentPrice: 2526.1, prevDayPrice: 2566.1 },
  { id: 'MARUTI',     name: 'Maruti Suzuki',         ticker: 'MARUTI',     exchange: 'NSE', units: 5,    avgPrice: 8000, currentPrice: 13287,  prevDayPrice: 13483  },
  { id: 'HINDUNILVR', name: 'Hindustan Unilever',    ticker: 'HINDUNILVR', exchange: 'NSE', units: 20,   avgPrice: 2500, currentPrice: 2290.9, prevDayPrice: 2307.2 },
  { id: 'TITAN',      name: 'Titan Company',         ticker: 'TITAN',      exchange: 'NSE', units: 15,   avgPrice: 2500, currentPrice: 4165,   prevDayPrice: 4205.6 },
  { id: 'ADANIPORTS', name: 'Adani Ports',           ticker: 'ADANIPORTS', exchange: 'NSE', units: 80,   avgPrice: 800,  currentPrice: 1735.9, prevDayPrice: 1767.3 },
  { id: 'NTPC',       name: 'NTPC',                  ticker: 'NTPC',       exchange: 'NSE', units: 250,  avgPrice: 250,  currentPrice: 396,    prevDayPrice: 392.95 },
  { id: 'KOTAKBANK',  name: 'Kotak Mahindra Bank',   ticker: 'KOTAKBANK',  exchange: 'NSE', units: 25,   avgPrice: 280,  currentPrice: 378.35, prevDayPrice: 381.05 },
  { id: 'DMART',      name: 'Avenue Supermarts',     ticker: 'DMART',      exchange: 'NSE', units: 10,   avgPrice: 3500, currentPrice: 4367.5, prevDayPrice: 4389.4 },
  { id: 'TATAMOTORS', name: 'Tata Motors',           ticker: 'TATAMOTORS', exchange: 'NSE', units: 729,  avgPrice: 550,  currentPrice: 411.5,  prevDayPrice: 420    },
  { id: 'SUNPHARMA',  name: 'Sun Pharmaceutical',    ticker: 'SUNPHARMA',  exchange: 'NSE', units: 30,   avgPrice: 1200, currentPrice: 1869.6, prevDayPrice: 1872.7 },
];

function computeStockFinancials(stock: Stock): StockFinancials {
  const invested = stock.units * stock.avgPrice;
  const currentValue = stock.units * stock.currentPrice;
  const pnl = currentValue - invested;
  const prevDayValue = stock.units * stock.prevDayPrice;
  const oneDayPnl = currentValue - prevDayValue;
  return {
    stockId: stock.id,
    invested,
    currentValue,
    pnl: Math.round(pnl * 100) / 100,
    pnlPct: Math.round((pnl / invested) * 10000) / 100,
    oneDayPnl: Math.round(oneDayPnl * 100) / 100,
    oneDayPnlPct: Math.round((oneDayPnl / prevDayValue) * 10000) / 100,
  };
}

export const stockFinancials: Record<string, StockFinancials> = Object.fromEntries(
  stocks.map((s) => [s.id, computeStockFinancials(s)])
);

export function stockPortfolioSummary() {
  const totalInvested = stocks.reduce((s, st) => s + stockFinancials[st.id].invested, 0);
  const totalValue = stocks.reduce((s, st) => s + stockFinancials[st.id].currentValue, 0);
  const totalPnl = totalValue - totalInvested;
  const oneDayPnl = stocks.reduce((s, st) => s + stockFinancials[st.id].oneDayPnl, 0);
  const prevDayTotal = stocks.reduce((s, st) => s + st.units * st.prevDayPrice, 0);
  return {
    totalInvested,
    totalValue,
    totalPnl: Math.round(totalPnl * 100) / 100,
    totalPnlPct: Math.round((totalPnl / totalInvested) * 10000) / 100,
    oneDayPnl: Math.round(oneDayPnl * 100) / 100,
    oneDayPnlPct: Math.round((oneDayPnl / prevDayTotal) * 10000) / 100,
  };
}
