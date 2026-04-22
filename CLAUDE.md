# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

**Tabs/Routes:**
- `/` - Category Pulse (KPIs, GMV chart, engine signals) - **built**
- `/sku-tower` - SKU Control Tower with filters and status badges - **built**
- `/assortment` - Choice Engine recommendations - **built**
- `/price` - Affordability Engine - **stub**
- `/lifecycle` - SKU Lifecycle Engine - **stub**
- `/profitability` - Profitability Engine - **stub**

## DH Brand Colors

Defined in `app/globals.css` as Tailwind theme colors:
- `dh-blue` (#131732) - Innovation Blue, dark backgrounds
- `dh-red` (#D61F26) - Fast Red, primary accent, CTAs (must always appear per brand guidelines)
- `dh-green` (#A2FAA3) - Tech Green, data/grid elements
- `dh-purple` (#4629FF) - Community Purple, intelligence/highlight layer
- `dh-gray` (#F5F5F6) - Dynamic Gray, light theme background

## Key Files

- `lib/sample-data.ts` - All sample data, brand colors, and type definitions
- `components/Header.tsx` - App header with entity selector dropdown
- `components/TabNav.tsx` - Tab navigation with route definitions
- `catman-cockpit-handoff.md` - Complete design specification with component interfaces, engine details, and data structures

## Data Types

Key interfaces defined in `lib/sample-data.ts`:
- `SAMPLE_KPIS` - Performance KPI cards
- `SAMPLE_SKUS` - SKU table rows with status and engine signals
- `SAMPLE_ASSORTMENT_RECS` - Choice Engine recommendations
- `SAMPLE_ENGINE_SIGNALS` - Alert cards linking to engine tabs
- `DH_ENTITIES` - List of Delivery Hero sub-entities for selector