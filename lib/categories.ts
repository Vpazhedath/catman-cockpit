// L0, L1, and L2 Category Structure for CatMan Cockpit

export interface L2Category {
  id: string;
  name: string;
}

export interface L1Category {
  id: string;
  name: string;
  l0: string;
  l2Categories: L2Category[];
}

export interface L0Category {
  id: string;
  name: string;
  l1Categories: L1Category[];
}

export const L0_CATEGORIES: L0Category[] = [
  {
    id: 'general-merchandise',
    name: 'General Merchandise',
    l1Categories: [
      {
        id: 'general-merchandise',
        name: 'General Merchandise',
        l0: 'general-merchandise',
        l2Categories: [
          { id: 'apparel-footwear-sports', name: 'Apparel / Footwear / Sports Equipment' },
          { id: 'books-magazines', name: 'Books / Magazines' },
          { id: 'electronics', name: 'Electronics' },
          { id: 'toys', name: 'Toys' },
        ],
      },
    ],
  },
  {
    id: 'non-food-grocery',
    name: 'Non-Food Grocery',
    l1Categories: [
      {
        id: 'home-pet',
        name: 'Home / Pet',
        l0: 'non-food-grocery',
        l2Categories: [
          { id: 'cleaning-laundry', name: 'Cleaning / Laundry' },
          { id: 'disposables', name: 'Disposables' },
          { id: 'hardware-misc', name: 'Hardware / Misc' },
          { id: 'household', name: 'Household' },
          { id: 'pet', name: 'Pet' },
          { id: 'seasonal-occasion', name: 'Seasonal / Occasion' },
        ],
      },
      {
        id: 'personal-care-baby-health',
        name: 'Personal Care / Baby / Health',
        l0: 'non-food-grocery',
        l2Categories: [
          { id: 'baby', name: 'Baby' },
          { id: 'health', name: 'Health' },
          { id: 'personal-care-beauty', name: 'Personal Care / Beauty' },
        ],
      },
      {
        id: 'smoking-tobacco',
        name: 'Smoking / Tobacco',
        l0: 'non-food-grocery',
        l2Categories: [
          { id: 'e-cigarettes-accessories', name: 'E-Cigarettes / Accessories' },
          { id: 'herbals-cannabis-accessories', name: 'Herbals / Cannabis / Accessories' },
          { id: 'smoking-accessories', name: 'Smoking Accessories' },
          { id: 'tobacco', name: 'Tobacco' },
        ],
      },
    ],
  },
  {
    id: 'bws',
    name: 'BWS',
    l1Categories: [
      {
        id: 'bws',
        name: 'BWS',
        l0: 'bws',
        l2Categories: [
          { id: 'beer-cider', name: 'Beer / Cider' },
          { id: 'pre-mixed', name: 'Pre-Mixed' },
          { id: 'spirits', name: 'Spirits' },
          { id: 'wine-sparkling-wine', name: 'Wine / Sparkling Wine' },
        ],
      },
    ],
  },
  {
    id: 'impulse',
    name: 'Impulse',
    l1Categories: [
      {
        id: 'beverages',
        name: 'Beverages',
        l0: 'impulse',
        l2Categories: [
          { id: 'juice-ice-tea-sports-energy', name: 'Juice / Ice Tea / Sports / Energy' },
          { id: 'soft-drinks-mixers', name: 'Soft Drinks / Mixers' },
          { id: 'specialty', name: 'Specialty' },
          { id: 'water', name: 'Water' },
        ],
      },
      {
        id: 'snacks',
        name: 'Snacks',
        l0: 'impulse',
        l2Categories: [
          { id: 'confectionary', name: 'Confectionary' },
          { id: 'other-snacks', name: 'Other Snacks' },
          { id: 'salty-snacks', name: 'Salty Snacks' },
        ],
      },
    ],
  },
  {
    id: 'packaged-food',
    name: 'Packaged Food',
    l1Categories: [
      {
        id: 'packaged-foods',
        name: 'Packaged Foods',
        l0: 'packaged-food',
        l2Categories: [
          { id: 'breakfast-spreads', name: 'Breakfast / Spreads' },
          { id: 'canned-jarred-instant-meals', name: 'Canned / Jarred / Instant Meals' },
          { id: 'cooking-condiments-baking-herbs-spices', name: 'Cooking / Condiments / Baking / Herbs / Spices' },
          { id: 'desserts', name: 'Desserts' },
          { id: 'pasta-rice-grains', name: 'Pasta / Rice / Grains' },
          { id: 'special-diet', name: 'Special Diet' },
          { id: 'tea-coffee', name: 'Tea / Coffee' },
        ],
      },
      {
        id: 'frozen',
        name: 'Frozen',
        l0: 'packaged-food',
        l2Categories: [
          { id: 'frozen-convenience-bakery', name: 'Frozen Convenience / Bakery' },
          { id: 'frozen-fruit-vegetables-potato', name: 'Frozen Fruit / Vegetables / Potato' },
          { id: 'frozen-meat-seafood', name: 'Frozen Meat / Seafood' },
          { id: 'ice', name: 'Ice' },
          { id: 'ice-cream-desserts', name: 'Ice Cream / Desserts' },
        ],
      },
    ],
  },
  {
    id: 'fresh',
    name: 'Fresh',
    l1Categories: [
      {
        id: 'bread-bakery',
        name: 'Bread / Bakery',
        l0: 'fresh',
        l2Categories: [
          { id: 'bread', name: 'Bread' },
          { id: 'sweet-bakery', name: 'Sweet Bakery' },
        ],
      },
      {
        id: 'dairy-chilled-eggs',
        name: 'Dairy / Chilled / Eggs',
        l0: 'fresh',
        l2Categories: [
          { id: 'dairy-eggs', name: 'Dairy / Eggs' },
          { id: 'deli-snacking', name: 'Deli / Snacking' },
          { id: 'milk', name: 'Milk' },
          { id: 'ready-meals', name: 'Ready Meals' },
        ],
      },
    ],
  },
  {
    id: 'ultra-fresh',
    name: 'Ultra Fresh',
    l1Categories: [
      {
        id: 'meat-seafood',
        name: 'Meat / Seafood',
        l0: 'ultra-fresh',
        l2Categories: [
          { id: 'fish-seafood', name: 'Fish / Seafood' },
          { id: 'meat', name: 'Meat' },
          { id: 'poultry', name: 'Poultry' },
        ],
      },
      {
        id: 'produce',
        name: 'Produce',
        l0: 'ultra-fresh',
        l2Categories: [
          { id: 'fruit', name: 'Fruit' },
          { id: 'prepared-fv-fresh-herbs', name: 'Prepared F&V / Fresh Herbs' },
          { id: 'vegetables', name: 'Vegetables' },
        ],
      },
      {
        id: 'ready-to-consume',
        name: 'Ready To Consume',
        l0: 'ultra-fresh',
        l2Categories: [
          { id: 'rtc-beverages', name: 'Beverages' },
          { id: 'rtc-food', name: 'Food' },
        ],
      },
    ],
  },
];

// Flat list of all L1 categories
export const ALL_L1_CATEGORIES: L1Category[] = L0_CATEGORIES.flatMap(l0 => l0.l1Categories);

// Flat list of all L2 categories
export const ALL_L2_CATEGORIES: L2Category[] = L0_CATEGORIES.flatMap(l0 =>
  l0.l1Categories.flatMap(l1 => l1.l2Categories)
);

// Get L1 categories for a given L0
export function getL1CategoriesForL0(l0Id: string): L1Category[] {
  const l0 = L0_CATEGORIES.find(c => c.id === l0Id);
  return l0?.l1Categories || [];
}

// Get L2 categories for a given L1
export function getL2CategoriesForL1(l1Id: string): L2Category[] {
  const l1 = ALL_L1_CATEGORIES.find(c => c.id === l1Id);
  return l1?.l2Categories || [];
}

// Get L0 category for a given L1
export function getL0ForL1(l1Id: string): L0Category | undefined {
  for (const l0 of L0_CATEGORIES) {
    const found = l0.l1Categories.find(l1 => l1.id === l1Id);
    if (found) return l0;
  }
  return undefined;
}

// Get L1 category for a given L2
export function getL1ForL2(l2Id: string): L1Category | undefined {
  for (const l1 of ALL_L1_CATEGORIES) {
    const found = l1.l2Categories.find(l2 => l2.id === l2Id);
    if (found) return l1;
  }
  return undefined;
}

// Get L1 category by ID
export function getL1CategoryById(l1Id: string): L1Category | undefined {
  return ALL_L1_CATEGORIES.find(c => c.id === l1Id);
}

// Get L0 category by ID
export function getL0CategoryById(l0Id: string): L0Category | undefined {
  return L0_CATEGORIES.find(c => c.id === l0Id);
}

// Get L2 category by ID
export function getL2CategoryById(l2Id: string): L2Category | undefined {
  return ALL_L2_CATEGORIES.find(c => c.id === l2Id);
}

// Category icons mapping (L0 and L1)
export const CATEGORY_ICONS: Record<string, string> = {
  // L0 Icons
  'general-merchandise': '🛍️',
  'non-food-grocery': '🧴',
  'bws': '🍺',
  'impulse': '🎁',
  'packaged-food': '📦',
  'fresh': '🥬',
  'ultra-fresh': '🥩',
  // L1 Icons
  'home-pet': '🏠',
  'personal-care-baby-health': '👶',
  'smoking-tobacco': '🚬',
  'beverages': '🥤',
  'snacks': '🍿',
  'packaged-foods': '🥫',
  'frozen': '🧊',
  'bread-bakery': '🍞',
  'dairy-chilled-eggs': '🥛',
  'meat-seafood': '🍖',
  'produce': '🥗',
  'ready-to-consume': '🍽️',
  // L2 Icons - Beverages
  'juice-ice-tea-sports-energy': '🧃',
  'soft-drinks-mixers': '🥤',
  'specialty': '☕',
  'water': '💧',
  // L2 Icons - Snacks
  'confectionary': '🍫',
  'other-snacks': '🍪',
  'salty-snacks': '🍿',
  // L2 Icons - Dairy
  'dairy-eggs': '🥚',
  'deli-snacking': '🧀',
  'milk': '🥛',
  'ready-meals': '🍱',
  // L2 Icons - Bread/Bakery
  'bread': '🍞',
  'sweet-bakery': '🥐',
  // L2 Icons - Frozen
  'frozen-convenience-bakery': '🥧',
  'frozen-fruit-vegetables-potato': '🥦',
  'frozen-meat-seafood': '🦐',
  'ice': '🧊',
  'ice-cream-desserts': '🍨',
  // L2 Icons - Meat/Seafood
  'fish-seafood': '🐟',
  'meat': '🥩',
  'poultry': '🍗',
  // L2 Icons - Produce
  'fruit': '🍎',
  'prepared-fv-fresh-herbs': '🌿',
  'vegetables': '🥕',
  // L2 Icons - Home/Pet
  'cleaning-laundry': '🧹',
  'disposables': '📦',
  'hardware-misc': '🔧',
  'household': '🏠',
  'pet': '🐕',
  'seasonal-occasion': '🎉',
  // L2 Icons - Personal Care
  'baby': '👶',
  'health': '💊',
  'personal-care-beauty': '💄',
  // L2 Icons - BWS
  'beer-cider': '🍺',
  'pre-mixed': '🍹',
  'spirits': '🥃',
  'wine-sparkling-wine': '🍷',
  // L2 Icons - Smoking/Tobacco
  'e-cigarettes-accessories': '💨',
  'herbals-cannabis-accessories': '🌿',
  'smoking-accessories': '🔥',
  'tobacco': '🚬',
  // L2 Icons - Packaged Foods
  'breakfast-spreads': '🥣',
  'canned-jarred-instant-meals': '🥫',
  'cooking-condiments-baking-herbs-spices': '🌶️',
  'desserts': '🍮',
  'pasta-rice-grains': '🍝',
  'special-diet': '🥗',
  'tea-coffee': '☕',
  // L2 Icons - General Merchandise
  'apparel-footwear-sports': '👟',
  'books-magazines': '📚',
  'electronics': '📱',
  'toys': '🧸',
  // L2 Icons - Ready to Consume
  'rtc-beverages': '🥤',
  'rtc-food': '🍔',
};

// Legacy category mapping (for backward compatibility with old category names)
export const LEGACY_CATEGORY_MAP: Record<string, string> = {
  'Dairy & Cheese': 'dairy-chilled-eggs',
  'Beverages': 'beverages',
  'Snacks & Chocolate': 'snacks',
  'Personal Care': 'personal-care-baby-health',
  'Household': 'home-pet',
  'Frozen Foods': 'frozen',
  'Spices': 'packaged-foods',
  'Cooking Ingredients': 'packaged-foods',
  'Snacks': 'snacks',
};

// Map legacy category to new L1 ID
export function mapLegacyCategory(legacyCategory: string): string {
  return LEGACY_CATEGORY_MAP[legacyCategory] || legacyCategory;
}