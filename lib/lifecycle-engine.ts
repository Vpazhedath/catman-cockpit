// SKU Lifecycle Engine - Based on DMart SKU Lifecycle Strategy V2
// https://docs.google.com/presentation/d/1PUNrn6RZS5hK28-53sxBu7Ehdv5rLN3BLjuZYgw-4zA

// ============================================
// TYPES & DEFINITIONS
// ============================================

export type SKUMaturityStage = 'new' | 'probation' | 'mature' | 'review' | 'phase-out';
export type SKUEfficiency = 'efficient' | 'slow-mover' | 'zero-mover' | 'low-availability';
export type SKUStatus = 'active' | 'on-hold' | 'discontinued' | 'retired';
export type SalesVelocity = 'high' | 'medium' | 'low' | 'zero';

export interface SKULifecycleState {
  skuId: string;
  name: string;
  category: string;
  supplier: string;

  // Lifecycle metrics
  daysInAssortment: number;
  maturityStage: SKUMaturityStage;
  efficiency: SKUEfficiency;
  status: SKUStatus;

  // Performance metrics
  weeklyUnitsSold: number;
  availability: number; // percentage
  salesVelocity: SalesVelocity;

  // Health metrics
  daysOnHand: number;
  shrinkage: number; // percentage of retail revenue
  serviceLevel: number; // percentage

  // Recommendations
  recommendedAction: RecommendedAction | null;
  clearanceDiscount: number | null;

  // Timestamps
  firstStockDate: Date | null;
  lastSaleDate: Date | null;
  statusChangedAt: Date | null;
}

export interface RecommendedAction {
  type: ActionType;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  deadline: Date;
  estimatedImpact: string;
}

export type ActionType =
  | 'discontinue'
  | 'clearance'
  | 'price-review'
  | 'supplier-negotiation'
  | 'range-expansion'
  | 'status-on-hold'
  | 'status-active'
  | 'stock-depletion';

// ============================================
// LIFECYCLE THRESHOLDS (from DMart strategy)
// ============================================

export const LIFECYCLE_THRESHOLDS = {
  // Maturity stages
  newSkuMaxDays: 30,
  probationMaxDays: 90,

  // Efficiency thresholds
  zeroMoverThreshold: 0, // units/week
  slowMoverThreshold: 1, // units/week
  lowAvailabilityThreshold: 80, // percentage

  // Status triggers
  zeroServiceLevelDays: 30, // days at 0% SL before on-hold
  discontinueServiceLevelDays: 60, // days at 0% SL before discontinue
  shrinkageWarningThreshold: 20, // % of retail revenue
  shrinkageActionThreshold: 30, // days above front margin

  // Clearance
  clearanceMinDiscount: 10,
  clearanceMaxDiscount: 70,

  // Days on Hand
  targetDaysOnHand: 14,
  warningDaysOnHand: 30,
  criticalDaysOnHand: 60,
};

// ============================================
// LIFECYCLE ENGINE
// ============================================

export class SKULifecycleEngine {

  /**
   * Determine SKU maturity stage based on days in assortment
   */
  static determineMaturityStage(daysInAssortment: number): SKUMaturityStage {
    if (daysInAssortment <= LIFECYCLE_THRESHOLDS.newSkuMaxDays) {
      return 'new';
    } else if (daysInAssortment <= LIFECYCLE_THRESHOLDS.probationMaxDays) {
      return 'probation';
    }
    return 'mature';
  }

  /**
   * Determine SKU efficiency classification
   */
  static determineEfficiency(
    weeklyUnitsSold: number,
    availability: number
  ): SKUEfficiency {
    const isLowAvailability = availability < LIFECYCLE_THRESHOLDS.lowAvailabilityThreshold;

    if (weeklyUnitsSold <= LIFECYCLE_THRESHOLDS.zeroMoverThreshold) {
      return isLowAvailability ? 'low-availability' : 'zero-mover';
    } else if (weeklyUnitsSold < LIFECYCLE_THRESHOLDS.slowMoverThreshold) {
      return isLowAvailability ? 'low-availability' : 'slow-mover';
    }
    return 'efficient';
  }

  /**
   * Generate SKU status recommendations based on performance
   */
  static generateRecommendation(sku: SKULifecycleState): RecommendedAction | null {
    const { efficiency, serviceLevel, shrinkage, daysOnHand, maturityStage, status } = sku;

    // 0% Service Level handling
    if (serviceLevel === 0) {
      if (status === 'on-hold') {
        return {
          type: 'discontinue',
          priority: 'high',
          reason: 'SKU at 0% service level for 60+ days with no supplier response',
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          estimatedImpact: 'Remove dead inventory, improve catalog efficiency',
        };
      }
      return {
        type: 'status-on-hold',
        priority: 'high',
        reason: 'SKU at 0% service level for 30+ days - supplier issue',
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        estimatedImpact: 'Prevent manual POs, identify supplier issues',
      };
    }

    // Shrinkage management (F/UF products)
    if (shrinkage > LIFECYCLE_THRESHOLDS.shrinkageWarningThreshold) {
      return {
        type: 'supplier-negotiation',
        priority: shrinkage > 30 ? 'high' : 'medium',
        reason: `Shrinkage at ${shrinkage.toFixed(1)}% of retail revenue exceeds threshold`,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        estimatedImpact: 'Reduce shrinkage cost, improve margins',
      };
    }

    // Zero/Slow mover handling (Mature SKUs only)
    if (maturityStage === 'mature') {
      if (efficiency === 'zero-mover') {
        return {
          type: 'discontinue',
          priority: 'medium',
          reason: 'Mature SKU with zero sales for extended period',
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          estimatedImpact: 'Improve assortment efficiency, reduce inventory cost',
        };
      }

      if (efficiency === 'slow-mover') {
        return {
          type: 'clearance',
          priority: 'low',
          reason: 'Mature SKU with low sales velocity',
          deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          estimatedImpact: 'Clear slow-moving inventory, free up working capital',
        };
      }

      // High performers - range expansion
      if (efficiency === 'efficient' && daysOnHand < LIFECYCLE_THRESHOLDS.targetDaysOnHand) {
        return {
          type: 'range-expansion',
          priority: 'low',
          reason: 'High-performing SKU with good stock turnover',
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          estimatedImpact: 'Increase sales, improve customer availability',
        };
      }
    }

    // Days on Hand warning
    if (daysOnHand > LIFECYCLE_THRESHOLDS.criticalDaysOnHand) {
      return {
        type: 'stock-depletion',
        priority: 'medium',
        reason: `Days on Hand at ${daysOnHand} days - critical inventory level`,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        estimatedImpact: 'Reduce inventory holding cost, prevent obsolescence',
      };
    }

    return null;
  }

  /**
   * Calculate recommended clearance discount
   */
  static calculateClearanceDiscount(sku: SKULifecycleState): number {
    const { efficiency, daysOnHand, shrinkage } = sku;

    // Base discount based on efficiency
    let baseDiscount = 0;
    if (efficiency === 'zero-mover') {
      baseDiscount = 40;
    } else if (efficiency === 'slow-mover') {
      baseDiscount = 25;
    }

    // Add urgency factor based on days on hand
    const dohFactor = Math.min(20, Math.floor((daysOnHand - 30) / 5) * 5);

    // Add shrinkage factor
    const shrinkageFactor = shrinkage > 20 ? 10 : 0;

    const totalDiscount = Math.min(
      LIFECYCLE_THRESHOLDS.clearanceMaxDiscount,
      baseDiscount + dohFactor + shrinkageFactor
    );

    return Math.max(LIFECYCLE_THRESHOLDS.clearanceMinDiscount, totalDiscount);
  }

  /**
   * Process a batch of SKUs and return lifecycle updates
   */
  static processSKUBatch(skus: SKULifecycleState[]): SKULifecycleState[] {
    return skus.map(sku => {
      // Update maturity stage
      const maturityStage = this.determineMaturityStage(sku.daysInAssortment);

      // Update efficiency
      const efficiency = this.determineEfficiency(sku.weeklyUnitsSold, sku.availability);

      // Generate recommendation
      const recommendation = this.generateRecommendation({
        ...sku,
        maturityStage,
        efficiency,
      });

      // Calculate clearance discount if applicable
      const clearanceDiscount = recommendation?.type === 'clearance'
        ? this.calculateClearanceDiscount({ ...sku, maturityStage, efficiency })
        : null;

      return {
        ...sku,
        maturityStage,
        efficiency,
        recommendedAction: recommendation,
        clearanceDiscount,
      };
    });
  }
}

// ============================================
// SAMPLE DATA FOR TESTING
// ============================================

export const SAMPLE_LIFECYCLE_SKUS: SKULifecycleState[] = [
  {
    skuId: 'SKU001',
    name: 'Almarai Full Cream 1L',
    category: 'Dairy',
    supplier: 'Almarai',
    daysInAssortment: 45,
    maturityStage: 'probation',
    efficiency: 'efficient',
    status: 'active',
    weeklyUnitsSold: 156,
    availability: 95,
    salesVelocity: 'high',
    daysOnHand: 12,
    shrinkage: 5,
    serviceLevel: 98,
    recommendedAction: null,
    clearanceDiscount: null,
    firstStockDate: new Date('2025-03-01'),
    lastSaleDate: new Date('2025-04-16'),
    statusChangedAt: null,
  },
  {
    skuId: 'SKU002',
    name: 'Nestle Pure Life 1.5L',
    category: 'Water',
    supplier: 'Nestle',
    daysInAssortment: 120,
    maturityStage: 'mature',
    efficiency: 'efficient',
    status: 'active',
    weeklyUnitsSold: 245,
    availability: 98,
    salesVelocity: 'high',
    daysOnHand: 8,
    shrinkage: 3,
    serviceLevel: 99,
    recommendedAction: null,
    clearanceDiscount: null,
    firstStockDate: new Date('2024-12-15'),
    lastSaleDate: new Date('2025-04-16'),
    statusChangedAt: null,
  },
  {
    skuId: 'SKU003',
    name: 'Lacnor Orange Juice 1L',
    category: 'Juices',
    supplier: 'Lacnor',
    daysInAssortment: 95,
    maturityStage: 'mature',
    efficiency: 'slow-mover',
    status: 'active',
    weeklyUnitsSold: 0.5,
    availability: 92,
    salesVelocity: 'low',
    daysOnHand: 45,
    shrinkage: 8,
    serviceLevel: 85,
    recommendedAction: null,
    clearanceDiscount: null,
    firstStockDate: new Date('2025-01-10'),
    lastSaleDate: new Date('2025-04-10'),
    statusChangedAt: null,
  },
  {
    skuId: 'SKU004',
    name: 'Barakat Fresh Milk 2L',
    category: 'Dairy',
    supplier: 'Barakat',
    daysInAssortment: 15,
    maturityStage: 'new',
    efficiency: 'efficient',
    status: 'active',
    weeklyUnitsSold: 89,
    availability: 88,
    salesVelocity: 'medium',
    daysOnHand: 5,
    shrinkage: 12,
    serviceLevel: 90,
    recommendedAction: null,
    clearanceDiscount: null,
    firstStockDate: new Date('2025-04-01'),
    lastSaleDate: new Date('2025-04-16'),
    statusChangedAt: null,
  },
  {
    skuId: 'SKU005',
    name: 'Almarai Laban 200ml',
    category: 'Dairy',
    supplier: 'Almarai',
    daysInAssortment: 180,
    maturityStage: 'mature',
    efficiency: 'zero-mover',
    status: 'on-hold',
    weeklyUnitsSold: 0,
    availability: 100,
    salesVelocity: 'zero',
    daysOnHand: 65,
    shrinkage: 25,
    serviceLevel: 95,
    recommendedAction: null,
    clearanceDiscount: null,
    firstStockDate: new Date('2024-10-15'),
    lastSaleDate: new Date('2025-02-20'),
    statusChangedAt: new Date('2025-03-01'),
  },
  {
    skuId: 'SKU006',
    name: 'Premium Greek Yogurt 500g',
    category: 'Dairy',
    supplier: 'Local Supplier',
    daysInAssortment: 35,
    maturityStage: 'probation',
    efficiency: 'slow-mover',
    status: 'active',
    weeklyUnitsSold: 0.3,
    availability: 75,
    salesVelocity: 'low',
    daysOnHand: 28,
    shrinkage: 35,
    serviceLevel: 0,
    recommendedAction: null,
    clearanceDiscount: null,
    firstStockDate: new Date('2025-03-12'),
    lastSaleDate: new Date('2025-04-05'),
    statusChangedAt: null,
  },
  {
    skuId: 'SKU007',
    name: 'Red Bull 250ml',
    category: 'Energy Drinks',
    supplier: 'Red Bull',
    daysInAssortment: 200,
    maturityStage: 'mature',
    efficiency: 'efficient',
    status: 'active',
    weeklyUnitsSold: 178,
    availability: 96,
    salesVelocity: 'high',
    daysOnHand: 10,
    shrinkage: 4,
    serviceLevel: 97,
    recommendedAction: null,
    clearanceDiscount: null,
    firstStockDate: new Date('2024-09-28'),
    lastSaleDate: new Date('2025-04-16'),
    statusChangedAt: null,
  },
  {
    skuId: 'SKU008',
    name: 'Organic Oat Milk 1L',
    category: 'Dairy Alternatives',
    supplier: 'NewCo',
    daysInAssortment: 25,
    maturityStage: 'new',
    efficiency: 'efficient',
    status: 'active',
    weeklyUnitsSold: 45,
    availability: 82,
    salesVelocity: 'medium',
    daysOnHand: 18,
    shrinkage: 15,
    serviceLevel: 88,
    recommendedAction: null,
    clearanceDiscount: null,
    firstStockDate: new Date('2025-03-22'),
    lastSaleDate: new Date('2025-04-16'),
    statusChangedAt: null,
  },
];