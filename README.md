# silence-objects-portal

SILENCE.OBJECTS Portal — PatternLabs B2B SaaS Dashboard

## Stack
- Next.js 14 + React 18 + TypeScript strict
- Tailwind CSS 3 + dark mode
- pnpm monorepo (apps/portal + packages/ui)
- Vercel deploy

## Dev
```bash
pnpm install
pnpm dev
```

## Structure
```
apps/portal/         — Next.js dashboard app
packages/ui/         — shared design system
```

## Domains
- patternslab.app — portal dashboard
- patternslab.work — investor portal
- patternlens.app — consumer PWA (separate repo)
