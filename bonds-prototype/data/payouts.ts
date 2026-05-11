import { Bond, bonds } from './bonds';

export type PayoutKind = 'interest' | 'principal';

export interface Payout {
  id: string;
  bondId: string;
  issuer: string;
  date: string; // ISO YYYY-MM-DD
  kind: PayoutKind;
  amount: number;
  received: boolean;
}

const TODAY = new Date('2026-05-12');

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function toISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function couponIntervalMonths(bond: Bond): number {
  switch (bond.couponFrequency) {
    case 'monthly': return 1;
    case 'semi-annual': return 6;
    case 'annual': return 12;
  }
}

function couponAmount(bond: Bond): number {
  const annual = bond.faceValue * bond.units * (bond.couponRate / 100);
  const perPeriod = annual / (12 / couponIntervalMonths(bond));
  return Math.round(perPeriod * 100) / 100;
}

function generatePayoutsForBond(bond: Bond): Payout[] {
  const payouts: Payout[] = [];
  const interval = couponIntervalMonths(bond);
  const coupon = couponAmount(bond);
  const issue = new Date(bond.issueDate);
  const maturity = new Date(bond.maturityDate);

  let idx = 0;
  let cursor = addMonths(issue, interval);

  while (cursor <= maturity) {
    const dateStr = toISO(cursor);
    const received = cursor < TODAY;
    payouts.push({
      id: `${bond.id}-C${idx}`,
      bondId: bond.id,
      issuer: bond.issuer,
      date: dateStr,
      kind: 'interest',
      amount: coupon,
      received,
    });
    idx++;
    cursor = addMonths(issue, interval * (idx + 1));
  }

  // Principal payout(s)
  if (bond.payoutType === 'staggered') {
    // 40% returned after year 1, 60% at maturity
    const totalPrincipal = bond.faceValue * bond.units;
    const firstReturnDate = addMonths(issue, 12);
    payouts.push({
      id: `${bond.id}-P1`,
      bondId: bond.id,
      issuer: bond.issuer,
      date: toISO(firstReturnDate),
      kind: 'principal',
      amount: Math.round(totalPrincipal * 0.4),
      received: firstReturnDate < TODAY,
    });
    payouts.push({
      id: `${bond.id}-P2`,
      bondId: bond.id,
      issuer: bond.issuer,
      date: toISO(maturity),
      kind: 'principal',
      amount: Math.round(totalPrincipal * 0.6),
      received: maturity < TODAY,
    });
  } else {
    payouts.push({
      id: `${bond.id}-P`,
      bondId: bond.id,
      issuer: bond.issuer,
      date: toISO(maturity),
      kind: 'principal',
      amount: bond.faceValue * bond.units,
      received: maturity < TODAY,
    });
  }

  return payouts;
}

export const allPayouts: Payout[] = bonds
  .flatMap(generatePayoutsForBond)
  .sort((a, b) => a.date.localeCompare(b.date));

export const upcomingPayouts = allPayouts.filter((p) => !p.received && p.bondId !== 'NH001');
export const receivedPayouts = allPayouts.filter((p) => p.received);

export function groupPayoutsByMonth(payouts: Payout[]): { monthKey: string; label: string; total: number; payouts: Payout[] }[] {
  const map = new Map<string, Payout[]>();
  for (const p of payouts) {
    const key = p.date.slice(0, 7); // YYYY-MM
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(p);
  }
  return Array.from(map.entries()).map(([key, ps]) => {
    const [year, month] = key.split('-');
    const label = new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleString('en-IN', {
      month: 'long',
      year: 'numeric',
    });
    return {
      monthKey: key,
      label,
      total: ps.reduce((sum, p) => sum + p.amount, 0),
      payouts: ps,
    };
  });
}

// Compute per-bond financials
export interface BondFinancials {
  bondId: string;
  invested: number;
  interestEarned: number; // sum of received interest payouts
  totalValue: number;     // invested + interestEarned
  marketPrice: number;    // approximate: close to face value for NCDs
  nextPayoutDate: string | null;
  nextPayoutAmount: number;
}

function computeFinancials(bond: Bond): BondFinancials {
  const invested = bond.faceValue * bond.units;
  const bondPayouts = allPayouts.filter((p) => p.bondId === bond.id);
  const interestEarned = bondPayouts
    .filter((p) => p.kind === 'interest' && p.received)
    .reduce((sum, p) => sum + p.amount, 0);
  const upcoming = bondPayouts.filter((p) => !p.received).sort((a, b) => a.date.localeCompare(b.date));
  const nextPayout = upcoming[0] ?? null;

  // Market price for NCDs is very close to face value; add slight premium/discount for realism
  const priceMultiplier = 1 + (bond.couponRate - bond.ytm) / bond.couponRate * 0.01;
  const marketPrice = Math.round(bond.faceValue * priceMultiplier * bond.units);

  return {
    bondId: bond.id,
    invested,
    interestEarned: Math.round(interestEarned * 100) / 100,
    totalValue: Math.round((invested + interestEarned) * 100) / 100,
    marketPrice,
    nextPayoutDate: nextPayout?.date ?? null,
    nextPayoutAmount: nextPayout?.amount ?? 0,
  };
}

export const bondFinancials: Record<string, BondFinancials> = Object.fromEntries(
  bonds.map((b) => [b.id, computeFinancials(b)])
);

export function portfolioSummary() {
  const active = bonds.filter((b) => b.status === 'active');
  const totalInvested = active.reduce((s, b) => s + bondFinancials[b.id].invested, 0);
  const totalInterest = active.reduce((s, b) => s + bondFinancials[b.id].interestEarned, 0);
  const totalValue = active.reduce((s, b) => s + bondFinancials[b.id].totalValue, 0);
  const hasStaggered = active.some((b) => b.payoutType === 'staggered');
  const principalReturned = active
    .filter((b) => b.payoutType === 'staggered')
    .reduce((s, b) => s + (b.principalReturned ?? 0), 0);
  return { totalInvested, totalInterest, totalValue, hasStaggered, principalReturned };
}
