# CatMan Cockpit — Claude Code Handoff
> Category Management Cockpit for Delivery Hero
> Generated from design session — provide this file to Claude Code to continue building

---

## 1. Project Overview

**Product name:** CatMan Cockpit (Category Management Cockpit)
**Owner:** Delivery Hero (parent) — built for use across all sub-entities
**Sub-entities:** Talabat, Hunger Station, Pandora, Pedidos Ya, MXFAD, and more
**Users:** ~300 category managers across 50 countries
**Goal:** A single unified interface replacing fragmented tools — one place for category managers to see performance, manage SKUs, and act on engine recommendations.

---

## 2. Brand / Design Tokens

```ts
// DH Brand Palette
export const DH_COLORS = {
  innovationBlue:  '#131732',  // dark bg, primary surface
  fastRed:         '#D61F26',  // primary accent — ALWAYS present per brand guidelines
  techGreen:       '#A2FAA3',  // grids, dots, data lines
  communityPurple: '#4629FF',  // highlights, intelligence layer
  dynamicGray:     '#F5F5F6',  // light theme background
  white:           '#FFFFFF',
}

// Usage rules (from DH brand doc):
// - Innovation Blue → dark theme background / text on light theme
// - Fast Red → logo, scribbles, CTAs — must always appear
// - Tech Green → used in grids, dot patterns, data visualisation
// - Community Purple → used with pictures, highlight text
// - Dynamic Gray → light theme page background
```

---

## 3. System Architecture

Four-layer stack (bottom → top, data flows upward):

```
┌─────────────────────────────────────────────────────────────────┐
│                  CATEGORY MANAGEMENT COCKPIT                     │
│         Unified interface · ~300 CMs · 50 countries             │
│  Performance | SKU Tower | Assortment | Price | Lifecycle | P&L  │
└────────────────────────────┬────────────────────────────────────┘
                             │ surfaces data
┌────────────────────────────▼────────────────────────────────────┐
│                     SKU CONTROL TOWER                            │
│     Horizontal data layer — end-to-end SKU view                 │
│   SKU name · category · status · cost · base price · discount   │
└──────┬──────────────┬──────────────┬──────────────┬────────────┘
       │              │              │              │
┌──────▼──────┐ ┌─────▼──────┐ ┌────▼──────┐ ┌────▼──────────┐
│   CHOICE    │ │    SKU     │ │AFFORDABIL-│ │PROFITABILITY  │
│   ENGINE   │ │ LIFECYCLE  │ │   ITY     │ │   ENGINE      │
│             │ │   ENGINE  │ │  ENGINE   │ │               │
│Assortment  │ │Add→phase-  │ │Price &    │ │Supplier       │
│recs        │ │out stages  │ │promo      │ │margins        │
│Semi-auto   │ │Full-auto   │ │Full-auto  │ │Semi-auto      │
└──────┬──────┘ └─────┬──────┘ └────┬──────┘ └────┬──────────┘
       │              │              │              │
┌──────▼──────────────▼──────────────▼──────────────▼──────────┐
│  CATALOG (foundational)   │   EXTERNAL DATA SOURCES           │
│  Existing SKU mgmt tool   │   Competitor · Nielsen · Search   │
└───────────────────────────┴───────────────────────────────────┘
```

### Engine Details

| Engine | Automation | Data Sources | Function |
|--------|-----------|--------------|----------|
| Choice Engine | Semi-automated | Competitor scrape, search terms, Nielsen data | Recommends missing SKUs to add to assortment |
| SKU Lifecycle | Fully automated | Internal velocity/performance | Manages SKU from listing → phase-out |
| Affordability | Fully automated | Competitor price signals | Price matching + promo recommendations |
| Profitability | Semi-automated | Supplier performance scorecard | Identifies margin renegotiation opportunities |

---

## 4. Cockpit UI — Tab Structure

```
Header:  [Brand] [Entity selector: Talabat UAE ▾] [🔔 Notifications]
Bar:     [Breadcrumb: All Categories › Beverages & Dairy]  [Date range]
Tabs:    Performance | SKU Control Tower | Assortment | Price & Promo | Lifecycle | Profitability
```

### Tab 1 — Performance (default view)
- **4 KPI cards:** GMV, Orders, Avg Basket, Category Coverage
  - Each shows: value + WoW delta (↑/↓ with green/red)
  - Coverage card also shows "N SKUs missing vs competitor"
- **GMV bar chart:** 7-day weekly trend, DH Fast Red bars, varying opacity oldest→newest
- **Engine Signals panel** (right sidebar): 4 compact cards, one per engine
  - Each: engine icon (colored) + 1-line alert + "View →" CTA
  - Signals badge showing active count

### Tab 2 — SKU Control Tower
- **Filter chips:** All | Live | New | OOS | Phase-out (with counts)
- **Table columns:** SKU Name | Category | Status Badge | Cost (AED) | Base Price | Discount | Margin | Engine Signals
- **Status badges:** Live (green), New (blue), OOS (red), Phase-out (amber)
- **Engine signal dots:** Small colored dots (one per engine with active signal)
- **Margin color coding:** green if healthy, red if below threshold

### Tab 3 — Assortment (Choice Engine)
- **Header:** "N assortment opportunities" + last updated timestamp
- **Segment switcher:** Missing SKUs | Underperforming | OOS Risk
- **3-column recommendation cards:**
  - Source tag: Competitor signal (blue) | Search trend (purple) | Nielsen data (amber)
  - SKU name + business rationale (2-3 lines)
  - Confidence score bar (green fill)
  - "Add to assortment" CTA button

### Tab 4 — Price & Promo (Affordability Engine) [to build]
- Competitor price comparison table
- Promo trigger recommendations
- Price gap analysis

### Tab 5 — Lifecycle (SKU Lifecycle Engine) [to build]
- SKU stage funnel (New → Active → Review → Phase-out)
- Velocity trend per SKU
- Automated stage transition log

### Tab 6 — Profitability (Profitability Engine) [to build]
- Supplier scorecard table
- Margin waterfall by category
- Renegotiation opportunity flags

---

## 5. Component Specs

### KPI Card
```tsx
interface KPICardProps {
  label: string        // "GMV" | "Orders" | "Avg basket" | "Coverage"
  value: string        // "AED 2.4M"
  delta: string        // "+12.4% WoW"
  direction: 'up' | 'down'
  subtitle?: string    // "23 SKUs missing vs competitor"
}
```

### SKU Table Row
```tsx
interface SKURow {
  name: string
  category: string
  status: 'live' | 'new' | 'oos' | 'phase-out'
  costPrice: number
  basePrice: number
  discount?: number    // percentage, optional
  margin: number       // percentage
  engineSignals: ('choice' | 'lifecycle' | 'affordability' | 'profitability')[]
}
```

### Assortment Recommendation Card
```tsx
interface AssortmentRec {
  source: 'competitor' | 'search' | 'nielsen'
  skuName: string
  rationale: string
  confidence: number   // 0–100
  onAdd: () => void
}
```

### Engine Signal
```tsx
interface EngineSignal {
  engine: 'choice' | 'lifecycle' | 'affordability' | 'profitability'
  message: string
  ctaLabel: string
  ctaTab: string       // which tab to navigate to
}
```

---

## 6. Sample Data (UAE · Beverages & Dairy)

```ts
export const SAMPLE_KPIS = [
  { label: 'GMV',               value: 'AED 2.4M', delta: '↑ 12.4% WoW', direction: 'up' },
  { label: 'Orders',            value: '18,420',   delta: '↑ 8.1% WoW',  direction: 'up' },
  { label: 'Avg basket',        value: 'AED 130',  delta: '↑ 4.2% WoW',  direction: 'up' },
  { label: 'Category coverage', value: '87%',      delta: '↓ 2.1% WoW',  direction: 'down',
    subtitle: '23 SKUs missing vs competitor' },
]

export const SAMPLE_GMV_TREND = [
  { day: 'Mon', value: 240000 },
  { day: 'Tue', value: 290000 },
  { day: 'Wed', value: 265000 },
  { day: 'Thu', value: 310000 },
  { day: 'Fri', value: 330000 },
  { day: 'Sat', value: 325000 },
  { day: 'Sun', value: 355000 },
]

export const SAMPLE_ENGINE_SIGNALS = [
  { engine: 'choice',        message: '23 missing SKUs vs Carrefour & Lulu',  ctaLabel: 'Review assortment →', ctaTab: 'assortment' },
  { engine: 'affordability', message: '14 SKUs priced 8–15% above market',    ctaLabel: 'View pricing →',      ctaTab: 'price' },
  { engine: 'lifecycle',     message: 'Almarai Laban 200ml phase-out flagged', ctaLabel: 'Review lifecycle →',  ctaTab: 'lifecycle' },
  { engine: 'profitability', message: '3 suppliers margin below 12%',          ctaLabel: 'View profitability →', ctaTab: 'profitability' },
]

export const SAMPLE_SKUS = [
  { name: 'Almarai Full Cream 1L',  category: 'Dairy',        status: 'live',       costPrice: 5.20, basePrice: 7.50, discount: null, margin: 31, engineSignals: ['lifecycle', 'choice'] },
  { name: 'Lacnor Orange Juice 1L', category: 'Juices',       status: 'live',       costPrice: 3.80, basePrice: 6.00, discount: 10,   margin: 37, engineSignals: ['affordability'] },
  { name: 'Nestle Pure Life 1.5L',  category: 'Water',        status: 'oos',        costPrice: 1.10, basePrice: 2.00, discount: null, margin: 45, engineSignals: ['lifecycle'] },
  { name: 'Barakat Fresh Milk 2L',  category: 'Dairy',        status: 'new',        costPrice: 7.50, basePrice: 11.00,discount: null, margin: 32, engineSignals: [] },
  { name: 'Coca-Cola 330ml Can',    category: 'Carbonated',   status: 'live',       costPrice: 1.90, basePrice: 3.25, discount: null, margin: 41, engineSignals: ['affordability'] },
  { name: 'Almarai Laban 200ml',    category: 'Dairy',        status: 'phase-out',  costPrice: 1.20, basePrice: 1.80, discount: null, margin: 25, engineSignals: ['lifecycle'] },
  { name: 'Red Bull 250ml',         category: 'Energy drinks',status: 'live',       costPrice: 4.50, basePrice: 7.00, discount: 5,    margin: 35, engineSignals: ['affordability', 'choice'] },
  { name: 'Sunkist Lemon 330ml',    category: 'Carbonated',   status: 'new',        costPrice: 2.10, basePrice: 3.50, discount: null, margin: 40, engineSignals: ['choice'] },
]

export const SAMPLE_ASSORTMENT_RECS = [
  {
    source: 'competitor',
    skuName: 'Sadia Choc Milk 200ml',
    rationale: 'Listed on Carrefour & Noon at AED 3.50. Ranked #4 in Dairy search. Est. 800+ units/month.',
    confidence: 91,
  },
  {
    source: 'search',
    skuName: 'Oat milk 1L',
    rationale: 'Search volume up 340% MoM in UAE. Zero coverage in category. Price potential AED 18–24.',
    confidence: 85,
  },
  {
    source: 'nielsen',
    skuName: 'Nadec Full Cream 2L',
    rationale: 'Top 3 nationally by unit sales in MT channel. Not listed on Talabat. Margin est. 28–32%.',
    confidence: 78,
  },
]
```

---

## 7. Icon Components (SVG)

Five icon options — all use DH brand palette. Recommended: **Arc** (Option 1).

### Icon: Arc (recommended)
```tsx
export const IconArc = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" rx="26" fill="#131732"/>
    <path d="M 88 36 A 37 37 0 1 1 88 84" fill="none" stroke="rgba(214,31,38,0.12)" strokeWidth="18" strokeLinecap="round"/>
    <path d="M 88 36 A 37 37 0 1 1 88 84" fill="none" stroke="#D61F26" strokeWidth="9" strokeLinecap="round"/>
    <circle cx="45" cy="52" r="2.5" fill="#A2FAA3" opacity={0.9}/>
    <circle cx="58" cy="52" r="2.5" fill="#A2FAA3" opacity={0.55}/>
    <circle cx="71" cy="52" r="2.5" fill="#4629FF" opacity={0.6}/>
    <circle cx="45" cy="63" r="2.5" fill="#A2FAA3" opacity={0.55}/>
    <circle cx="58" cy="63" r="4"   fill="#A2FAA3"/>
    <circle cx="71" cy="63" r="2.5" fill="#4629FF" opacity={0.8}/>
    <circle cx="45" cy="74" r="2.5" fill="#4629FF" opacity={0.5}/>
    <circle cx="58" cy="74" r="2.5" fill="#A2FAA3" opacity={0.55}/>
    <circle cx="71" cy="74" r="2.5" fill="#A2FAA3" opacity={0.9}/>
    <rect x="76" y="7" width="34" height="16" rx="8" fill="#D61F26"/>
    <text x="93" y="18" fontSize="8" fontWeight="700" fill="white" textAnchor="middle" fontFamily="sans-serif">DH</text>
  </svg>
)
```

### Icon: HUD
```tsx
export const IconHUD = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" rx="26" fill="#131732"/>
    <circle cx="60" cy="62" r="38" fill="none" stroke="#D61F26" strokeWidth="2.5"/>
    <circle cx="60" cy="62" r="24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
    <line x1="60" y1="20" x2="60" y2="30" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"/>
    <line x1="60" y1="94" x2="60" y2="104" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"/>
    <line x1="18" y1="62" x2="28" y2="62" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"/>
    <line x1="92" y1="62" x2="102" y2="62" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="60" cy="20" r="3.5" fill="#A2FAA3"/>
    <circle cx="100" cy="62" r="3.5" fill="#4629FF"/>
    <circle cx="60" cy="104" r="3.5" fill="#A2FAA3" opacity={0.5}/>
    <circle cx="20" cy="62"  r="3.5" fill="white" opacity={0.4}/>
    <circle cx="60" cy="62" r="6" fill="#D61F26"/>
    <circle cx="60" cy="62" r="2.5" fill="white"/>
    <rect x="76" y="7" width="34" height="16" rx="8" fill="#D61F26"/>
    <text x="93" y="18" fontSize="8" fontWeight="700" fill="white" textAnchor="middle" fontFamily="sans-serif">DH</text>
  </svg>
)
```

### Icon: Gauge
```tsx
export const IconGauge = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" rx="26" fill="#131732"/>
    <path d="M 20 101 A 46 46 0 1 1 100 101" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="9" strokeLinecap="round"/>
    <path d="M 20 101 A 46 46 0 0 1 30 43"  fill="none" stroke="#A2FAA3" strokeWidth="9" strokeLinecap="round"/>
    <path d="M 30 43  A 46 46 0 0 1 76 35"  fill="none" stroke="#4629FF" strokeWidth="9" strokeLinecap="round"/>
    <path d="M 76 35  A 46 46 0 0 1 100 101" fill="none" stroke="#D61F26" strokeWidth="9" strokeLinecap="round"/>
    <line x1="60" y1="78" x2="53" y2="37" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="60" cy="78" r="5" fill="#D61F26"/>
    <circle cx="60" cy="78" r="2" fill="white"/>
    <rect x="76" y="7" width="34" height="16" rx="8" fill="#D61F26"/>
    <text x="93" y="18" fontSize="8" fontWeight="700" fill="white" textAnchor="middle" fontFamily="sans-serif">DH</text>
  </svg>
)
```

### Icon: Matrix
```tsx
export const IconMatrix = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" rx="26" fill="#131732"/>
    <circle cx="36" cy="40" r="5" fill="#A2FAA3" opacity={0.9}/>
    <circle cx="60" cy="40" r="5" fill="#A2FAA3" opacity={0.6}/>
    <circle cx="84" cy="40" r="5" fill="#4629FF" opacity={0.5}/>
    <circle cx="36" cy="62" r="5" fill="#A2FAA3" opacity={0.6}/>
    <circle cx="60" cy="62" r="5" fill="#A2FAA3"/>
    <circle cx="84" cy="62" r="5" fill="#4629FF" opacity={0.8}/>
    <circle cx="36" cy="84" r="5" fill="#4629FF" opacity={0.4}/>
    <circle cx="60" cy="84" r="5" fill="#A2FAA3" opacity={0.5}/>
    <circle cx="84" cy="84" r="5" fill="#A2FAA3" opacity={0.9}/>
    <circle cx="60" cy="62" r="30" fill="none" stroke="#D61F26" strokeWidth="1.5"/>
    <line x1="30" y1="62" x2="44" y2="62" stroke="#D61F26" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="76" y1="62" x2="90" y2="62" stroke="#D61F26" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="60" y1="30" x2="60" y2="44" stroke="#D61F26" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="60" y1="80" x2="60" y2="94" stroke="#D61F26" strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="76" y="7" width="34" height="16" rx="8" fill="#D61F26"/>
    <text x="93" y="18" fontSize="8" fontWeight="700" fill="white" textAnchor="middle" fontFamily="sans-serif">DH</text>
  </svg>
)
```

### Icon: Layers
```tsx
export const IconLayers = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" rx="26" fill="#131732"/>
    {/* Layer 1: Cockpit (red) */}
    <rect x="34" y="28" width="52" height="15" rx="7" fill="#D61F26"/>
    {/* Layer 2: SKU Tower (purple) */}
    <rect x="24" y="50" width="72" height="15" rx="7" fill="#4629FF"/>
    {/* Layer 3: Engines (green) */}
    <rect x="14" y="72" width="92" height="15" rx="7" fill="#A2FAA3"/>
    <circle cx="43" cy="35" r="2.5" fill="rgba(255,255,255,0.5)"/>
    <circle cx="54" cy="35" r="2.5" fill="rgba(255,255,255,0.3)"/>
    <circle cx="65" cy="35" r="2.5" fill="rgba(255,255,255,0.5)"/>
    <circle cx="43" cy="57" r="2.5" fill="rgba(255,255,255,0.4)"/>
    <circle cx="55" cy="57" r="2.5" fill="rgba(255,255,255,0.6)"/>
    <circle cx="67" cy="57" r="2.5" fill="rgba(255,255,255,0.4)"/>
    <rect x="76" y="7" width="34" height="16" rx="8" fill="#D61F26"/>
    <text x="93" y="18" fontSize="8" fontWeight="700" fill="white" textAnchor="middle" fontFamily="sans-serif">DH</text>
  </svg>
)
```

---

## 8. What to Build Next (Suggested Claude Code Prompts)

Use these prompts with Claude Code, providing this file as context each time:

### Phase 1 — Foundation
```
Using the handoff doc as context, scaffold a Next.js app for CatMan Cockpit.
Set up the routing, DH brand tokens, and layout shell with the header,
breadcrumb bar, and tab navigation. Use Tailwind CSS.
```

### Phase 2 — Performance Tab
```
Using the handoff doc, build the Performance tab:
- 4 KPI cards using SAMPLE_KPIS data
- GMV bar chart using SAMPLE_GMV_TREND (Recharts or plain SVG)
- Engine Signals sidebar using SAMPLE_ENGINE_SIGNALS
Match the DH colour palette exactly.
```

### Phase 3 — SKU Control Tower
```
Using the handoff doc, build the SKU Control Tower tab:
- Filter chips (All / Live / New / OOS / Phase-out) with counts
- Sortable table using SAMPLE_SKUS data
- Status badges, margin colour coding, engine signal dots
```

### Phase 4 — Assortment Tab
```
Using the handoff doc, build the Assortment tab:
- Segment switcher (Missing SKUs / Underperforming / OOS Risk)
- 3-column recommendation card grid using SAMPLE_ASSORTMENT_RECS
- Confidence score bars, source tags, Add to assortment CTA
```

### Ongoing — Entity + Category Switcher
```
Using the handoff doc, add a working entity selector (dropdown showing
all DH sub-entities) and a category breadcrumb with drill-down.
Switching entity or category should update the page title and
re-render all data views.
```

---

## 9. Files Already Created

| File | Description |
|------|-------------|
| `catman_cockpit_icon_options_dh.html` | All 5 icon options with DH branding, browser preview |
| `catman_cockpit_icons_download.html` | Same icons with SVG + PNG download buttons |

---

## 10. Key Decisions Made

- **Architecture:** 4-layer stack. Catalog stays as a separate foundational tool; the cockpit sits on top.
- **SKU Control Tower:** Built as a horizontal data layer, not a tab — it surfaces into the cockpit as its own tab but is the backbone for all engine outputs.
- **Automation tiers:** SKU Lifecycle and Affordability are fully automated; Choice and Profitability are semi-automated (human decision required before action).
- **Icon:** 5 options designed; Arc (Option 1) recommended — C for Cockpit+Category with green dot grid inside. Fast Red must always be present per DH brand rules.
- **Brand:** Innovation Blue (#131732) backgrounds, Fast Red (#D61F26) as primary accent, Tech Green (#A2FAA3) for data/grid elements, Community Purple (#4629FF) for intelligence/highlight layer.
