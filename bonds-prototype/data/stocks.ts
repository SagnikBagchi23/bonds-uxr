export interface Stock {
  id: string;
  name: string;
  ticker: string;
  exchange: 'NSE' | 'BSE';
  units: number;
  avgPrice: number;
  currentPrice: number;
}

export interface StockFinancials {
  stockId: string;
  invested: number;
  currentValue: number;
  pnl: number;
  pnlPct: number;
}

export const stocks: Stock[] = [
  { id: 'RELIANCE',   name: 'Reliance Industries',   ticker: 'RELIANCE',   exchange: 'NSE', units: 30,  avgPrice: 2750,  currentPrice: 2940  },
  { id: 'TCS',        name: 'Tata Consultancy Svcs', ticker: 'TCS',        exchange: 'NSE', units: 20,  avgPrice: 3800,  currentPrice: 4180  },
  { id: 'HDFCBANK',   name: 'HDFC Bank',             ticker: 'HDFCBANK',   exchange: 'NSE', units: 100, avgPrice: 1600,  currentPrice: 1820  },
  { id: 'INFY',       name: 'Infosys',               ticker: 'INFY',       exchange: 'NSE', units: 40,  avgPrice: 1550,  currentPrice: 1750  },
  { id: 'ICICIBANK',  name: 'ICICI Bank',            ticker: 'ICICIBANK',  exchange: 'NSE', units: 60,  avgPrice: 1050,  currentPrice: 1240  },
  { id: 'BHARTIARTL', name: 'Bharti Airtel',         ticker: 'BHARTIARTL', exchange: 'NSE', units: 50,  avgPrice: 1200,  currentPrice: 1520  },
  { id: 'BAJFINANCE', name: 'Bajaj Finance',         ticker: 'BAJFINANCE', exchange: 'NSE', units: 10,  avgPrice: 6500,  currentPrice: 7200  },
  { id: 'LT',         name: 'Larsen & Toubro',       ticker: 'LT',         exchange: 'NSE', units: 20,  avgPrice: 3400,  currentPrice: 3750  },
  { id: 'SBIN',       name: 'State Bank of India',   ticker: 'SBIN',       exchange: 'NSE', units: 120, avgPrice: 750,   currentPrice: 870   },
  { id: 'WIPRO',      name: 'Wipro',                 ticker: 'WIPRO',      exchange: 'NSE', units: 80,  avgPrice: 480,   currentPrice: 570   },
  { id: 'ASIANPAINT', name: 'Asian Paints',          ticker: 'ASIANPAINT', exchange: 'NSE', units: 20,  avgPrice: 3000,  currentPrice: 2750  },
  { id: 'MARUTI',     name: 'Maruti Suzuki',         ticker: 'MARUTI',     exchange: 'NSE', units: 5,   avgPrice: 11000, currentPrice: 13200 },
  { id: 'HINDUNILVR', name: 'Hindustan Unilever',    ticker: 'HINDUNILVR', exchange: 'NSE', units: 20,  avgPrice: 2700,  currentPrice: 2480  },
  { id: 'TITAN',      name: 'Titan Company',         ticker: 'TITAN',      exchange: 'NSE', units: 15,  avgPrice: 3200,  currentPrice: 3820  },
  { id: 'ADANIPORTS', name: 'Adani Ports',           ticker: 'ADANIPORTS', exchange: 'NSE', units: 60,  avgPrice: 1100,  currentPrice: 1380  },
  { id: 'NTPC',       name: 'NTPC',                  ticker: 'NTPC',       exchange: 'NSE', units: 200, avgPrice: 340,   currentPrice: 410   },
  { id: 'KOTAKBANK',  name: 'Kotak Mahindra Bank',   ticker: 'KOTAKBANK',  exchange: 'NSE', units: 25,  avgPrice: 1900,  currentPrice: 2250  },
  { id: 'DMART',      name: 'Avenue Supermarts',     ticker: 'DMART',      exchange: 'NSE', units: 10,  avgPrice: 4800,  currentPrice: 5600  },
  { id: 'TATAMOTORS', name: 'Tata Motors',           ticker: 'TATAMOTORS', exchange: 'NSE', units: 80,  avgPrice: 1000,  currentPrice: 980   },
  { id: 'SUNPHARMA',  name: 'Sun Pharmaceutical',    ticker: 'SUNPHARMA',  exchange: 'NSE', units: 30,  avgPrice: 1600,  currentPrice: 1850  },
];

function computeStockFinancials(stock: Stock): StockFinancials {
  const invested = stock.units * stock.avgPrice;
  const currentValue = stock.units * stock.currentPrice;
  const pnl = currentValue - invested;
  return {
    stockId: stock.id,
    invested,
    currentValue,
    pnl: Math.round(pnl * 100) / 100,
    pnlPct: Math.round((pnl / invested) * 10000) / 100,
  };
}

export const stockFinancials: Record<string, StockFinancials> = Object.fromEntries(
  stocks.map((s) => [s.id, computeStockFinancials(s)])
);

export function stockPortfolioSummary() {
  const totalInvested = stocks.reduce((s, st) => s + stockFinancials[st.id].invested, 0);
  const totalValue = stocks.reduce((s, st) => s + stockFinancials[st.id].currentValue, 0);
  const totalPnl = totalValue - totalInvested;
  return {
    totalInvested,
    totalValue,
    totalPnl: Math.round(totalPnl * 100) / 100,
    totalPnlPct: Math.round((totalPnl / totalInvested) * 10000) / 100,
  };
}
