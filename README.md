# Bonds Holdings — UXR Prototype

A React Native / Expo prototype for user research on the bonds holdings experience in Groww Invest. Tests comprehension of bond terms (YTM, coupon rate, face value) and findability of key data points (next payout, interest earned, maturity).

## Live Web Preview

Deployed on Vercel — renders inside an iPhone 14 mockup for UXR sessions.

## Running Locally

```bash
cd bonds-prototype
npm install
npm run web       # browser (with iPhone mockup)
npm run ios       # Expo Go on iOS
npm run android   # Expo Go on Android
```

## Repo Structure

```
bonds-uxr/
├── bonds-prototype/          # Expo app (TypeScript)
│   ├── app/
│   │   ├── _layout.tsx       # Root layout; iPhone 14 web mockup
│   │   ├── (tabs)/
│   │   │   └── stocks/
│   │   │       └── holdings/ # Main bonds holdings screen
│   │   ├── bond/[id].tsx     # Bond detail screen
│   │   ├── payout-schedule.tsx
│   │   └── matured-bonds.tsx
│   ├── components/
│   │   ├── BondCard.tsx      # Per-bond card with cycling data states
│   │   ├── BondSummaryCard.tsx
│   │   └── SegmentedToggle.tsx
│   ├── data/                 # Static mock data (7 NCDs)
│   ├── theme/                # Mint DS color + typography tokens
│   └── hooks/                # useHideValues, useBondCardState
├── mint-ds-groww-invest-v0.18.md   # Design system reference
├── rules-groww-invest-v0.32.md     # Groww design rules
├── bonds-holdings.html             # Earlier HTML prototype
└── vercel.json                     # Vercel build config
```

## Screens

| Screen | Route | Status |
|---|---|---|
| Bonds Holdings | `/(tabs)/stocks/holdings` | ✅ |
| Bond Detail | `/bond/[id]` | ✅ |
| Payout Schedule | `/payout-schedule` | ✅ |
| Matured Bonds | `/matured-bonds` | ✅ |

## Mock Data

7 real Indian NCDs: Kosamattam Finance, Muthoot Fincorp, IIFL Samasta Finance, Navi Finance (staggered principal), UGRO Capital, Nido Home Finance (matured), Edelweiss Finance.

## Design

Tokens from Mint DS v0.18. Fonts: Sohne-Kraftig (numbers/headings), GrowwSans Regular + Medium (body).
