# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

## Project Overview

**CatMan Cockpit** - Category Management Cockpit for Delivery Hero. A unified interface for ~300 category managers across 50 countries to view performance, manage SKUs, and act on engine recommendations.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run Next.js linter
```

## Architecture

**Stack:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Recharts

**Four-layer system:**
1. **Cockpit (UI)** - This application
2. **SKU Control Tower** - Horizontal data layer for end-to-end SKU view
3. **Engines** - Choice (assortment recs), Lifecycle (SKU stages), Affordability (pricing), Profitability (margins)
4. **Catalog + External Data** - Foundational SKU data + competitor/NIelsen/search signals

**Routes:**
- `/` - Category Pulse (KPIs, GMV chart, engine signals)
- `/sku-tower` - SKU Control Tower with drilldown panel
- `/assortment` - Choice Engine recommendations
- `/price` - Affordability Engine
- `/lifecycle` - Lifecycle Engine
- `/profitability` - Supplier Performance Scorecard (SPS v1)

## DH Brand Colors

- `dh-blue` (#131732) - Innovation Blue, dark backgrounds
- `dh-red` (#D61F26) - Fast Red, primary accent, CTAs
- `dh-green` (#A2FAA3) - Tech Green, data/grid elements
- `dh-purple` (#4629FF) - Community Purple, intelligence/highlight layer
- `dh-gray` (#F5F5F6) - Dynamic Gray, light theme background

## Key Files

- `lib/sample-data.ts` - All sample data, brand colors, and type definitions
- `components/AppShell.tsx` - Main layout with sidebar and header
- `components/CatalystPanel.tsx` - Cat-alyst AI agent panel
- `components/SKUDrilldownPanel.tsx` - SKU detail view with cluster management

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.