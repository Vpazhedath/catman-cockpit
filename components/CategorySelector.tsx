'use client';

import { useState, useEffect } from 'react';
import { L0_CATEGORIES, CATEGORY_ICONS, getL1CategoriesForL0, getL2CategoriesForL1, getL1CategoryById, getL0CategoryById, getL2CategoryById } from '@/lib/categories';

interface CategorySelectorProps {
  selectedL0: string;
  selectedL1: string;
  selectedL2: string;
  onL0Select: (l0: string) => void;
  onL1Select: (l1: string) => void;
  onL2Select: (l2: string) => void;
}

export function CategorySelector({ selectedL0, selectedL1, selectedL2, onL0Select, onL1Select, onL2Select }: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedL0, setExpandedL0] = useState<string | null>(null);
  const [expandedL1, setExpandedL1] = useState<string | null>(null);

  const selectedL0Category = getL0CategoryById(selectedL0);
  const selectedL1Category = getL1CategoryById(selectedL1);
  const selectedL2Category = getL2CategoryById(selectedL2);

  // Reset expanded states when closing
  useEffect(() => {
    if (!isOpen) {
      setExpandedL0(null);
      setExpandedL1(null);
    }
  }, [isOpen]);

  const handleL0Click = (l0Id: string) => {
    const l1Categories = getL1CategoriesForL0(l0Id);

    if (expandedL0 === l0Id) {
      // Collapse if already expanded
      setExpandedL0(null);
      setExpandedL1(null);
    } else {
      // Expand to show L1 categories
      setExpandedL0(l0Id);
      setExpandedL1(null);
    }

    // Select L0 and auto-select first L1/L2
    onL0Select(l0Id);
    if (l1Categories.length > 0) {
      onL1Select(l1Categories[0].id);
      if (l1Categories[0].l2Categories.length > 0) {
        onL2Select(l1Categories[0].l2Categories[0].id);
      } else {
        onL2Select('all');
      }
    } else {
      onL1Select('all');
      onL2Select('all');
    }

    // Only close if there's a single L1 with single/no L2 (nothing to drill into)
    const hasMultipleL1 = l1Categories.length > 1;
    const hasL2ToExplore = l1Categories.some(l1 => l1.l2Categories.length > 1);
    if (!hasMultipleL1 && !hasL2ToExplore) {
      setIsOpen(false);
    }
  };

  const handleL1Click = (l1Id: string, l0Id: string) => {
    const l1Category = getL1CategoryById(l1Id);

    if (expandedL1 === l1Id) {
      setExpandedL1(null);
    } else {
      setExpandedL1(l1Id);
    }

    onL0Select(l0Id);
    onL1Select(l1Id);

    // Auto-select first L2
    if (l1Category && l1Category.l2Categories.length > 0) {
      onL2Select(l1Category.l2Categories[0].id);
    } else {
      onL2Select('all');
    }

    // Only close if there are no L2 categories to explore
    if (!l1Category || l1Category.l2Categories.length <= 1) {
      setIsOpen(false);
    }
  };

  const handleL2Click = (l2Id: string, l1Id: string, l0Id: string) => {
    onL0Select(l0Id);
    onL1Select(l1Id);
    onL2Select(l2Id);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (selectedL2 && selectedL2 !== 'all' && selectedL2Category) {
      return selectedL2Category.name;
    }
    if (selectedL1 && selectedL1 !== 'all' && selectedL1Category) {
      return selectedL1Category.name;
    }
    if (selectedL0 && selectedL0 !== 'all' && selectedL0Category) {
      return selectedL0Category.name;
    }
    return 'All Categories';
  };

  const getDisplayIcon = () => {
    if (selectedL2 && selectedL2 !== 'all') {
      return CATEGORY_ICONS[selectedL2] || CATEGORY_ICONS[selectedL1] || CATEGORY_ICONS[selectedL0] || '📁';
    }
    if (selectedL1 && selectedL1 !== 'all') {
      return CATEGORY_ICONS[selectedL1] || CATEGORY_ICONS[selectedL0] || '📁';
    }
    if (selectedL0 && selectedL0 !== 'all') {
      return CATEGORY_ICONS[selectedL0] || '📁';
    }
    return '📁';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-cp-color-surface-primary border border-cp-color-border-primary rounded-lg hover:bg-cp-color-surface-secondary transition min-w-48"
      >
        <span>{getDisplayIcon()}</span>
        <span className="text-sm font-medium text-cp-color-text-primary truncate">
          {getDisplayText()}
        </span>
        <svg className="w-4 h-4 text-cp-color-text-tertiary ml-auto shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-1 bg-cp-color-surface-primary rounded-lg shadow-lg border border-cp-color-border-primary py-1 min-w-80 max-h-[70vh] overflow-y-auto z-50">
            {/* All Categories option */}
            <button
              onClick={() => {
                onL0Select('all');
                onL1Select('all');
                onL2Select('all');
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-cp-color-surface-secondary transition ${
                selectedL0 === 'all' ? 'bg-cp-color-surface-brand text-cp-color-text-inverse' : 'text-cp-color-text-primary'
              }`}
            >
              <span>📁</span>
              All Categories
            </button>

            {/* L0 Categories with expandable L1 and L2 */}
            {L0_CATEGORIES.map((l0) => (
              <div key={l0.id}>
                {/* L0 Header */}
                <button
                  onClick={() => handleL0Click(l0.id)}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-cp-color-surface-secondary transition ${
                    selectedL0 === l0.id && selectedL1 === 'all' ? 'bg-cp-color-surface-secondary font-medium text-cp-color-text-brand' : 'text-cp-color-text-primary'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{CATEGORY_ICONS[l0.id] || '📁'}</span>
                    <span className="font-medium">{l0.name}</span>
                  </div>
                  <svg
                    className={`w-4 h-4 text-cp-color-text-tertiary transition-transform ${expandedL0 === l0.id ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* L1 Categories */}
                {expandedL0 === l0.id && (
                  <div className="bg-cp-color-surface-secondary/30">
                    {l0.l1Categories.map((l1) => (
                      <div key={l1.id}>
                        {/* L1 Header */}
                        <button
                          onClick={() => handleL1Click(l1.id, l0.id)}
                          className={`w-full text-left pl-8 pr-4 py-2 text-sm flex items-center justify-between hover:bg-cp-color-surface-secondary transition ${
                            selectedL1 === l1.id && selectedL2 === 'all' ? 'font-medium text-cp-color-text-brand' : 'text-cp-color-text-secondary'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{CATEGORY_ICONS[l1.id] || '📁'}</span>
                            {l1.name}
                          </div>
                          {l1.l2Categories.length > 1 && (
                            <svg
                              className={`w-3 h-3 text-cp-color-text-tertiary transition-transform ${expandedL1 === l1.id ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </button>

                        {/* L2 Categories */}
                        {expandedL1 === l1.id && l1.l2Categories.length > 1 && (
                          <div className="bg-cp-color-surface-secondary/50">
                            {l1.l2Categories.map((l2) => (
                              <button
                                key={l2.id}
                                onClick={() => handleL2Click(l2.id, l1.id, l0.id)}
                                className={`w-full text-left pl-14 pr-4 py-1.5 text-xs flex items-center gap-2 hover:bg-cp-color-surface-secondary transition ${
                                  selectedL2 === l2.id ? 'font-medium text-cp-color-text-brand' : 'text-cp-color-text-tertiary'
                                }`}
                              >
                                <span>{CATEGORY_ICONS[l2.id] || '📁'}</span>
                                {l2.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}