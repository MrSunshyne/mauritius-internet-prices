# Mauritius Internet Prices

An open source project to compare prepaid mobile internet data pack prices from all operators in Mauritius.

## Operators Tracked

- **my.t** (Mauritius Telecom)
- **Emtel**
- **CHILI** (MTML)

## Data Source

All prices are taken from publicly advertised prices on operator websites. Data is stored as TypeScript files in `app/data/plans.ts`.

## Tech Stack

- Nuxt 4 (Vue 3)
- TypeScript
- Static site generation (GitHub Pages)

## Development

```
npm install
npm run dev
```

## Build

```
npm run generate
```

## Contribute

If you notice outdated prices or missing plans, feel free to open a PR updating `app/data/plans.ts`.
