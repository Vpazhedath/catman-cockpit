// DH Brand Palette
export const DH_COLORS = {
  innovationBlue: '#131732',
  fastRed: '#D61F26',
  techGreen: '#A2FAA3',
  communityPurple: '#4629FF',
  dynamicGray: '#F5F5F6',
  white: '#FFFFFF',
} as const;

// Sample KPI Data
export const SAMPLE_KPIS = [
  { label: 'GMV', value: 'AED 2.4M', delta: '+12.4% WoW', direction: 'up' as const },
  { label: 'Orders', value: '18,420', delta: '+8.1% WoW', direction: 'up' as const },
  { label: 'Avg basket', value: 'AED 130', delta: '+4.2% WoW', direction: 'up' as const },
  { label: 'Category coverage', value: '87%', delta: '-2.1% WoW', direction: 'down' as const,
    subtitle: '23 SKUs missing vs competitor' },
];

// Sample GMV Trend Data
export const SAMPLE_GMV_TREND = [
  { day: 'Mon', value: 240000 },
  { day: 'Tue', value: 290000 },
  { day: 'Wed', value: 265000 },
  { day: 'Thu', value: 310000 },
  { day: 'Fri', value: 330000 },
  { day: 'Sat', value: 325000 },
  { day: 'Sun', value: 355000 },
];

// Sample Engine Signals
export const SAMPLE_ENGINE_SIGNALS = [
  { engine: 'choice' as const, message: '23 missing SKUs vs Carrefour & Lulu', ctaLabel: 'Review assortment →', ctaTab: 'assortment' },
  { engine: 'affordability' as const, message: '14 SKUs priced 8–15% above market', ctaLabel: 'View pricing →', ctaTab: 'price' },
  { engine: 'lifecycle' as const, message: 'Almarai Laban 200ml phase-out flagged', ctaLabel: 'Review lifecycle →', ctaTab: 'lifecycle' },
  { engine: 'profitability' as const, message: '3 suppliers margin below 12%', ctaLabel: 'View profitability →', ctaTab: 'profitability' },
];

// Sample SKU Data
export const SAMPLE_SKUS = [
  { name: 'Almarai Full Cream 1L', category: 'Dairy', status: 'live' as const, costPrice: 5.20, basePrice: 7.50, discount: null, margin: 31, engineSignals: ['lifecycle', 'choice'] as const },
  { name: 'Lacnor Orange Juice 1L', category: 'Juices', status: 'live' as const, costPrice: 3.80, basePrice: 6.00, discount: 10, margin: 37, engineSignals: ['affordability'] as const },
  { name: 'Nestle Pure Life 1.5L', category: 'Water', status: 'oos' as const, costPrice: 1.10, basePrice: 2.00, discount: null, margin: 45, engineSignals: ['lifecycle'] as const },
  { name: 'Barakat Fresh Milk 2L', category: 'Dairy', status: 'new' as const, costPrice: 7.50, basePrice: 11.00, discount: null, margin: 32, engineSignals: [] as const },
  { name: 'Coca-Cola 330ml Can', category: 'Carbonated', status: 'live' as const, costPrice: 1.90, basePrice: 3.25, discount: null, margin: 41, engineSignals: ['affordability'] as const },
  { name: 'Almarai Laban 200ml', category: 'Dairy', status: 'phase-out' as const, costPrice: 1.20, basePrice: 1.80, discount: null, margin: 25, engineSignals: ['lifecycle'] as const },
  { name: 'Red Bull 250ml', category: 'Energy drinks', status: 'live' as const, costPrice: 4.50, basePrice: 7.00, discount: 5, margin: 35, engineSignals: ['affordability', 'choice'] as const },
  { name: 'Sunkist Lemon 330ml', category: 'Carbonated', status: 'new' as const, costPrice: 2.10, basePrice: 3.50, discount: null, margin: 40, engineSignals: ['choice'] as const },
];

// Sample Assortment Recommendations
export const SAMPLE_ASSORTMENT_RECS = [
  {
    source: 'competitor' as const,
    skuName: 'Sadia Choc Milk 200ml',
    rationale: 'Listed on Carrefour & Noon at AED 3.50. Ranked #4 in Dairy search. Est. 800+ units/month.',
    confidence: 91,
  },
  {
    source: 'search' as const,
    skuName: 'Oat milk 1L',
    rationale: 'Search volume up 340% MoM in UAE. Zero coverage in category. Price potential AED 18–24.',
    confidence: 85,
  },
  {
    source: 'nielsen' as const,
    skuName: 'Nadec Full Cream 2L',
    rationale: 'Top 3 nationally by unit sales in MT channel. Not listed on Talabat. Margin est. 28–32%.',
    confidence: 78,
  },
];

// DH Entities
export const DH_ENTITIES = [
  'Talabat UAE',
  'Talabat Kuwait',
  'Talabat Egypt',
  'Hunger Station',
  'Pandora',
  'Pedidos Ya',
  'MXFAD',
];

// Categories
export const CATEGORIES = [
  { name: 'All Categories', path: '/' },
  { name: 'Beverages & Dairy', path: '/beverages-dairy' },
  { name: 'Snacks & Confectionery', path: '/snacks' },
  { name: 'Fresh & Frozen', path: '/fresh-frozen' },
  { name: 'Grocery & Staples', path: '/grocery' },
];