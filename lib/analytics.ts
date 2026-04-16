// Analytics and tracking utilities

interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
}

// Track user interactions
export function trackEvent(event: AnalyticsEvent): void {
  // In production, this would send to analytics service
  console.log('Analytics:', event);

  // Example: Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
    });
  }
}

// Common event tracking helpers
export const analytics = {
  tabChanged: (tab: string) => trackEvent({
    event: 'navigation',
    category: 'Tab',
    action: 'change',
    label: tab,
  }),

  filterApplied: (filterType: string, value: string) => trackEvent({
    event: 'interaction',
    category: 'Filter',
    action: 'apply',
    label: `${filterType}: ${value}`,
  }),

  skuViewed: (skuId: string) => trackEvent({
    event: 'interaction',
    category: 'SKU',
    action: 'view',
    label: skuId,
  }),

  actionTaken: (actionType: string, skuId: string) => trackEvent({
    event: 'interaction',
    category: 'Action',
    action: actionType,
    label: skuId,
  }),

  exportTriggered: (dataType: string) => trackEvent({
    event: 'interaction',
    category: 'Export',
    action: 'trigger',
    label: dataType,
  }),

  entityChanged: (entity: string) => trackEvent({
    event: 'navigation',
    category: 'Entity',
    action: 'change',
    label: entity,
  }),

  categoryChanged: (category: string) => trackEvent({
    event: 'navigation',
    category: 'Category',
    action: 'change',
    label: category,
  }),

  searchPerformed: (query: string, results: number) => trackEvent({
    event: 'interaction',
    category: 'Search',
    action: 'perform',
    label: query,
    value: results,
  }),
};

// Performance monitoring
export function measurePerformance(name: string, fn: () => void): void {
  const start = performance.now();
  fn();
  const duration = performance.now() - start;

  console.log(`Performance [${name}]: ${duration.toFixed(2)}ms`);

  // Track slow operations
  if (duration > 1000) {
    trackEvent({
      event: 'performance',
      category: 'Slow Operation',
      action: name,
      value: Math.round(duration),
    });
  }
}

// User session tracking
export function initSessionTracking(): void {
  if (typeof window === 'undefined') return;

  // Track session start
  trackEvent({
    event: 'session',
    category: 'User',
    action: 'start',
  });

  // Track page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      trackEvent({
        event: 'session',
        category: 'User',
        action: 'background',
      });
    } else {
      trackEvent({
        event: 'session',
        category: 'User',
        action: 'foreground',
      });
    }
  });
}