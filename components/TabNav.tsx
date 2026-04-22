'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { name: 'Category Pulse', href: '/' },
  { name: 'SKU Control Tower', href: '/sku-tower' },
  { name: 'Choice', href: '/assortment' },
  { name: 'Affordability', href: '/price' },
  { name: 'Lifecycle', href: '/lifecycle' },
  { name: 'Profitability', href: '/profitability' },
];

export function TabNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 px-6">
      <div className="flex gap-1">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`px-4 py-3 text-sm font-medium transition border-b-2 -mb-px ${
                isActive
                  ? 'text-dh-red border-dh-red'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}