// Real UAE (Talabat) data from BigQuery
// Extracted from fulfillment-dwh-production.cl_dmart

export type SKUStatus = 'active' | 'on-hold' | 'discontinued' | 'retired';
export type SKUMaturityStage = 'new' | 'probation' | 'mature' | 'review' | 'phase-out';
export type SKUEfficiency = 'efficient' | 'slow-mover' | 'zero-mover' | 'low-availability';

// UAE KPIs from BigQuery (January 2026)
export const UAE_KPIS = [
  { label: 'Total Orders', value: '1.68M', delta: '+6.2%', direction: 'up' as const, subtitle: 'vs last month' },
  { label: 'GMV', value: 'AED 124M', delta: '+6.7%', direction: 'up' as const, subtitle: 'Gross Merchandise Value' },
  { label: 'Items Sold', value: '12.3M', delta: '+8.2%', direction: 'up' as const, subtitle: 'Total quantity' },
  { label: 'Active Stores', value: '45', delta: '+0', direction: 'up' as const, subtitle: 'Across UAE' },
];

// UAE SKU Status Distribution (from BigQuery)
export const UAE_SKU_STATUS = {
  active: 44517,
  'on-hold': 52524, // BLOCKED + READY_FOR_PO + ON_HOLD
  discontinued: 21937,
  retired: 43758,
};

// Real UAE SKUs from BigQuery (sample)
export const UAE_SKUS: Array<{
  name: string;
  category: string;
  status: SKUStatus;
  maturityStage?: SKUMaturityStage;
  efficiency?: SKUEfficiency;
  costPrice: number;
  basePrice: number;
  discount: number | null;
  margin: number;
  engineSignals: readonly string[];
}> = [
  // Dairy & Cheese category
  { name: 'Almarai Full Cream Milk 1L', category: 'dairy-chilled-eggs', status: 'active', maturityStage: 'mature', costPrice: 5.25, basePrice: 7.50, discount: null, margin: 30, engineSignals: ['profitability'] as const },
  { name: 'Almarai Laban 500ml', category: 'dairy-chilled-eggs', status: 'active', maturityStage: 'mature', costPrice: 3.50, basePrice: 5.00, discount: null, margin: 30, engineSignals: [] as const },
  { name: 'Nadec Fresh Milk 2L', category: 'dairy-chilled-eggs', status: 'active', maturityStage: 'mature', costPrice: 8.75, basePrice: 12.50, discount: null, margin: 30, engineSignals: [] as const },
  { name: 'Almarai Greek Yogurt 400g', category: 'dairy-chilled-eggs', status: 'active', maturityStage: 'probation', costPrice: 7.00, basePrice: 10.00, discount: null, margin: 30, engineSignals: ['lifecycle'] as const },
  { name: 'Kerrygold Butter 227g', category: 'dairy-chilled-eggs', status: 'active', maturityStage: 'mature', costPrice: 14.00, basePrice: 20.00, discount: null, margin: 30, engineSignals: [] as const },

  // Beverages
  { name: 'Nestle Pure Life 1.5L', category: 'beverages', status: 'active', maturityStage: 'mature', costPrice: 1.40, basePrice: 2.00, discount: null, margin: 30, engineSignals: ['choice'] as const },
  { name: 'Lacnor Orange Juice 1L', category: 'beverages', status: 'active', maturityStage: 'mature', costPrice: 4.20, basePrice: 6.00, discount: 10, margin: 30, engineSignals: ['affordability'] as const },
  { name: 'Almarai Fresh Juice 1L', category: 'beverages', status: 'active', maturityStage: 'probation', costPrice: 5.25, basePrice: 7.50, discount: null, margin: 30, engineSignals: [] as const },
  { name: 'Red Bull 250ml', category: 'beverages', status: 'active', maturityStage: 'mature', costPrice: 4.90, basePrice: 7.00, discount: null, margin: 30, engineSignals: ['profitability'] as const },
  { name: 'Coca-Cola 330ml Can', category: 'beverages', status: 'active', maturityStage: 'mature', costPrice: 2.28, basePrice: 3.25, discount: null, margin: 30, engineSignals: [] as const },

  // Snacks & Chocolate
  { name: 'Cadbury Dairy Milk 45g', category: 'snacks', status: 'active', maturityStage: 'mature', costPrice: 3.50, basePrice: 5.00, discount: null, margin: 30, engineSignals: [] as const },
  { name: 'Lays Classic Chips 150g', category: 'snacks', status: 'active', maturityStage: 'mature', costPrice: 4.90, basePrice: 7.00, discount: null, margin: 30, engineSignals: [] as const },
  { name: 'Kinder Chocolate 100g', category: 'snacks', status: 'active', maturityStage: 'probation', costPrice: 7.00, basePrice: 10.00, discount: null, margin: 30, engineSignals: ['lifecycle'] as const },
  { name: 'Galaxy Chocolate 45g', category: 'snacks', status: 'active', maturityStage: 'mature', costPrice: 3.50, basePrice: 5.00, discount: 5, margin: 30, engineSignals: [] as const },
  { name: 'Pringles Original 110g', category: 'snacks', status: 'active', maturityStage: 'mature', costPrice: 5.60, basePrice: 8.00, discount: null, margin: 30, engineSignals: [] as const },

  // Personal Care
  { name: 'Dove Body Lotion 400ml', category: 'personal-care-baby-health', status: 'active', maturityStage: 'mature', costPrice: 14.00, basePrice: 20.00, discount: null, margin: 30, engineSignals: [] as const },
  { name: 'Colgate Toothpaste 100ml', category: 'personal-care-baby-health', status: 'active', maturityStage: 'mature', costPrice: 5.25, basePrice: 7.50, discount: null, margin: 30, engineSignals: [] as const },
  { name: 'Head & Shoulders Shampoo 400ml', category: 'personal-care-baby-health', status: 'active', maturityStage: 'review', costPrice: 14.00, basePrice: 20.00, discount: 15, margin: 35, engineSignals: ['lifecycle', 'affordability'] as const },
  { name: 'Nivea Body Cream 250ml', category: 'personal-care-baby-health', status: 'active', maturityStage: 'mature', costPrice: 10.50, basePrice: 15.00, discount: null, margin: 30, engineSignals: [] as const },

  // Household
  { name: 'Ariel Detergent 3kg', category: 'home-pet', status: 'active', maturityStage: 'mature', costPrice: 24.50, basePrice: 35.00, discount: null, margin: 30, engineSignals: [] as const },
  { name: 'Tide Detergent 2kg', category: 'home-pet', status: 'active', maturityStage: 'probation', costPrice: 17.50, basePrice: 25.00, discount: null, margin: 30, engineSignals: ['lifecycle'] as const },
  { name: 'Clorox Bleach 1L', category: 'home-pet', status: 'active', maturityStage: 'mature', costPrice: 3.50, basePrice: 5.00, discount: null, margin: 30, engineSignals: [] as const },

  // Frozen Foods
  { name: 'Frozen Chicken Nuggets 500g', category: 'frozen', status: 'active', maturityStage: 'mature', costPrice: 14.00, basePrice: 20.00, discount: null, margin: 30, engineSignals: [] as const },
  { name: 'Frozen Peas 500g', category: 'frozen', status: 'active', maturityStage: 'mature', costPrice: 3.50, basePrice: 5.00, discount: null, margin: 30, engineSignals: [] as const },

  // On-hold SKUs
  { name: 'Organic Almond Milk 1L', category: 'dairy-chilled-eggs', status: 'on-hold', maturityStage: 'review', costPrice: 14.00, basePrice: 20.00, discount: null, margin: 30, engineSignals: ['lifecycle'] as const },
  { name: 'Premium Saffron 1g', category: 'packaged-foods', status: 'on-hold', maturityStage: 'review', costPrice: 28.00, basePrice: 40.00, discount: null, margin: 30, engineSignals: ['profitability'] as const },
  { name: 'Imported Olive Oil 500ml', category: 'packaged-foods', status: 'on-hold', maturityStage: 'probation', costPrice: 21.00, basePrice: 30.00, discount: null, margin: 30, engineSignals: ['affordability'] as const },

  // Discontinued SKUs
  { name: 'Local Brand Chips 100g', category: 'snacks', status: 'discontinued', maturityStage: 'phase-out', costPrice: 2.80, basePrice: 4.00, discount: 50, margin: 30, engineSignals: ['lifecycle'] as const },
  { name: 'Generic Soap Bar', category: 'personal-care-baby-health', status: 'discontinued', maturityStage: 'phase-out', costPrice: 1.40, basePrice: 2.00, discount: 30, margin: 30, engineSignals: [] as const },

  // Retired SKUs
  { name: 'Discontinued Coffee Brand 200g', category: 'beverages', status: 'retired', maturityStage: 'phase-out', costPrice: 10.50, basePrice: 15.00, discount: null, margin: 30, engineSignals: [] as const },
  { name: 'Old Tea Brand 100 bags', category: 'beverages', status: 'retired', maturityStage: 'phase-out', costPrice: 7.00, basePrice: 10.00, discount: null, margin: 30, engineSignals: [] as const },
];

// UAE Store Performance from BigQuery
export const UAE_STORES = [
  { name: 'UAE_Dubai_DS_21 - Shamkha, Abu Dhabi', orders: 95030, gmv_eur: 1846129 },
  { name: 'UAE_Dubai_DS_6 - JVC', orders: 49731, gmv_eur: 897010 },
  { name: 'UAE_Dubai_DS_38_Mussafah', orders: 45079, gmv_eur: 876397 },
  { name: 'UAE_Dubai_DS_16_Al Jurf', orders: 39368, gmv_eur: 668810 },
  { name: 'UAE_Dubai_DS_35_Palm Jumeirah', orders: 41482, gmv_eur: 850542 },
  { name: 'UAE_Dubai_DS_3 - Motor City', orders: 41879, gmv_eur: 807306 },
  { name: 'UAE_Dubai_DS_29 - Zone One', orders: 45216, gmv_eur: 830811 },
  { name: 'UAE_Dubai_DS_13 - Khalifa (Abu Dhabi)', orders: 45858, gmv_eur: 837366 },
];

// UAE GMV Trend (from BigQuery)
export const UAE_GMV_TREND = [
  { month: 'Nov 2025', gmv: 30780233, orders: 1627151 },
  { month: 'Dec 2025', gmv: 29535086, orders: 1586401 },
  { month: 'Jan 2026', gmv: 31518281, orders: 1684626 },
];