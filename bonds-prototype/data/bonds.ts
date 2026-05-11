export type CouponFrequency = 'monthly' | 'semi-annual' | 'annual';
export type PayoutType = 'cumulative' | 'staggered';
export type BondStatus = 'active' | 'matured';

export interface Bond {
  id: string;
  issuer: string;
  isin: string;
  rating: string;
  faceValue: number;
  units: number;
  couponRate: number;
  ytm: number;
  issueDate: string;
  maturityDate: string;
  couponFrequency: CouponFrequency;
  payoutType: PayoutType;
  status: BondStatus;
  // For staggered bonds: partial principal already returned
  principalReturned?: number;
}

export const bonds: Bond[] = [
  {
    id: 'KF001',
    issuer: 'Kosamattam Finance',
    isin: 'INE129I07048',
    rating: 'AA-',
    faceValue: 1000,
    units: 50,
    couponRate: 10.25,
    ytm: 10.1,
    issueDate: '2023-06-15',
    maturityDate: '2026-06-15',
    couponFrequency: 'annual',
    payoutType: 'cumulative',
    status: 'active',
  },
  {
    id: 'MF001',
    issuer: 'Muthoot Fincorp',
    isin: 'INE724N07014',
    rating: 'AA',
    faceValue: 1000,
    units: 100,
    couponRate: 10.5,
    ytm: 10.35,
    issueDate: '2022-09-01',
    maturityDate: '2027-09-01',
    couponFrequency: 'monthly',
    payoutType: 'cumulative',
    status: 'active',
  },
  {
    id: 'IS001',
    issuer: 'IIFL Samasta Finance',
    isin: 'INE0J7C07016',
    rating: 'A+',
    faceValue: 1000,
    units: 25,
    couponRate: 11.0,
    ytm: 10.8,
    issueDate: '2024-01-10',
    maturityDate: '2027-01-10',
    couponFrequency: 'annual',
    payoutType: 'cumulative',
    status: 'active',
  },
  {
    id: 'NF001',
    issuer: 'Navi Finance',
    isin: 'INE020A07003',
    rating: 'A',
    faceValue: 1000,
    units: 200,
    couponRate: 12.0,
    ytm: 11.7,
    issueDate: '2023-11-20',
    maturityDate: '2026-11-20',
    couponFrequency: 'annual',
    payoutType: 'staggered',
    status: 'active',
    // 40% of principal returned after year 1 (₹80,000 of ₹200,000)
    principalReturned: 80000,
  },
  {
    id: 'UG001',
    issuer: 'UGRO Capital',
    isin: 'INE583D07034',
    rating: 'BBB+',
    faceValue: 1000,
    units: 30,
    couponRate: 10.5,
    ytm: 10.3,
    issueDate: '2023-03-05',
    maturityDate: '2027-03-05',
    couponFrequency: 'semi-annual',
    payoutType: 'cumulative',
    status: 'active',
  },
  {
    id: 'EW001',
    issuer: 'Edelweiss Finance',
    isin: 'INE918K07DM2',
    rating: 'AA-',
    faceValue: 1000,
    units: 60,
    couponRate: 10.5,
    ytm: 10.3,
    issueDate: '2023-08-15',
    maturityDate: '2028-08-15',
    couponFrequency: 'annual',
    payoutType: 'cumulative',
    status: 'active',
  },
  {
    id: 'NH001',
    issuer: 'Nido Home Finance',
    isin: 'INE491M07027',
    rating: 'A-',
    faceValue: 1000,
    units: 75,
    couponRate: 10.25,
    ytm: 10.1,
    issueDate: '2022-07-01',
    maturityDate: '2025-07-01',
    couponFrequency: 'annual',
    payoutType: 'cumulative',
    status: 'matured',
  },
];

export const activeBonds = bonds.filter((b) => b.status === 'active');
export const maturedBonds = bonds.filter((b) => b.status === 'matured');
