'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { DH_ENTITIES } from '@/lib/sample-data';
import { useTheme } from '@/lib/ThemeContext';
import { useAppContext } from '@/lib/AppContext';
import { useCatalyst } from '@/lib/CatalystContext';
import { CommandPalette } from '@/components/CommandPalette';
import { NotificationPanel } from '@/components/NotificationPanel';
import { CatalystPanel } from '@/components/CatalystPanel';
import { AffordabilityShieldIcon } from '@/components/EngineIcons';

const navSections = [
  { label: 'Overview', items: [
    { id: '/', name: 'Category Pulse', icon: 'bar-chart' },
  ]},
  { label: 'SKU Management', items: [
    { id: '/sku-tower', name: 'SKU Control Tower', icon: 'inventory' },
    { id: '/assortment', name: 'Choice', icon: 'add' },
  ]},
  { label: 'Engines', items: [
    { id: '/price', name: 'Affordability', icon: 'cart' },
    { id: '/lifecycle', name: 'Lifecycle', icon: 'orders' },
    { id: '/profitability', name: 'Profitability', icon: 'line-chart' },
  ]},
];

const font = 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)';

// Simple icon components to replace img references
function NavIcon({ name, active, t }: { name: string; active: boolean; t: boolean }) {
  const color = active ? '#4629FF' : (t ? '#b9bac1' : '#6C6D73');
  const props = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.75 };
  switch (name) {
    case 'bar-chart': return <svg {...props}><path d="M18 20V10M12 20V4M6 20v-6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'inventory': return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1" strokeLinecap="round"/><rect x="14" y="3" width="7" height="7" rx="1" strokeLinecap="round"/><rect x="3" y="14" width="7" height="7" rx="1" strokeLinecap="round"/><rect x="14" y="14" width="7" height="7" rx="1" strokeLinecap="round"/></svg>;
    case 'add': return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8" strokeLinecap="round"/></svg>;
    case 'cart': return <AffordabilityShieldIcon size={18} color={color} />;
    case 'orders': return <svg {...props}><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'line-chart': return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 8v4l2 2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    default: return <svg {...props}><circle cx="12" cy="12" r="9"/></svg>;
  }
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const { state, setEntity, setCategoryL0, setCategoryL1, setCategoryL2 } = useAppContext();
  const { state: catalystState, togglePanel } = useCatalyst();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [entityOpen, setEntityOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const t = theme === 'dark';

  // Simple category options for the header breadcrumb
  const categoryOptions = [
    { id: 'all', name: 'All Categories' },
    { id: 'beverages', name: 'Beverages' },
    { id: 'dairy-chilled-eggs', name: 'Dairy & Eggs' },
    { id: 'snacks', name: 'Snacks & Confectionery' },
    { id: 'personal-care-baby-health', name: 'Personal Care' },
    { id: 'home-pet', name: 'Home & Pet' },
    { id: 'frozen', name: 'Frozen Foods' },
    { id: 'packaged-foods', name: 'Packaged Foods' },
  ];

  const selectedCategoryName = categoryOptions.find(c => c.id === state.categoryL0)?.name || 'All Categories';

  // Colors based on theme
  const fg1 = t ? '#fff' : '#141415';

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: font, transition: 'background 200ms, color 200ms', background: t ? '#141415' : '#F4F5F6', color: t ? '#fff' : '#141415' }}>
      {/* Sidebar */}
      <aside style={{ display: 'flex', flexDirection: 'column', borderRight: `1px solid ${t ? '#343437' : '#E9EAEC'}`, width: sidebarCollapsed ? 64 : 240, background: t ? '#1E1E20' : '#fff', transition: 'width 200ms, background 200ms', overflow: 'hidden', flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 14px 12px', whiteSpace: 'nowrap' }}>
          <div style={{ width: 28, height: 28, flexShrink: 0 }}>
            <svg width="28" height="28" viewBox="0 0 120 120"><rect width="120" height="120" rx="26" fill="#4629FF"/><path d="M 88 36 A 37 37 0 1 1 88 84" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round"/><circle cx="50" cy="57" r="3" fill="#A2FAA3"/><circle cx="60" cy="57" r="3" fill="#A2FAA3" opacity=".6"/><circle cx="70" cy="57" r="3" fill="#A2FAA3" opacity=".3"/></svg>
          </div>
          {!sidebarCollapsed && <span style={{ font: `700 16px/1 ${font}`, letterSpacing: '-0.01em' }}>CatMan</span>}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ border: 0, background: 'transparent', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex', marginLeft: sidebarCollapsed ? 0 : 'auto', color: t ? '#93949D' : '#6C6D73' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={sidebarCollapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"}/></svg>
          </button>
        </div>

        {/* Entity Selector */}
        {!sidebarCollapsed && (
          <div style={{ position: 'relative', margin: '0 12px 8px' }}>
            <button onClick={() => setEntityOpen(!entityOpen)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 10px', borderRadius: 8, border: 0, cursor: 'pointer', background: t ? '#343437' : '#F4F5F6', color: t ? '#fff' : '#141415' }}>
              <span style={{ flex: 1, textAlign: 'left', font: `600 12px/1.3 ${font}`, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{state.entity}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            {entityOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, borderRadius: 10, boxShadow: '0 4px 24px rgba(20,20,21,.16)', marginTop: 4, padding: 4, maxHeight: 240, overflow: 'auto', background: t ? '#343437' : '#fff', border: `1px solid ${t ? '#434347' : '#E9EAEC'}` }}>
                {DH_ENTITIES.map(e => (
                  <button key={e} onClick={() => { setEntity(e); setEntityOpen(false); }} style={{ display: 'block', width: '100%', textAlign: 'left', border: 0, padding: '8px 10px', borderRadius: 6, cursor: 'pointer', font: `500 12px/1.3 ${font}`, background: e === state.entity ? (t ? '#434347' : '#EDEBFF') : 'transparent', color: e === state.entity ? '#4629FF' : (t ? '#fff' : '#141415') }}>
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, overflow: 'auto', padding: '0 8px' }}>
          {navSections.map(sec => (
            <div key={sec.label} style={{ marginBottom: 16 }}>
              {!sidebarCollapsed && <div style={{ font: `600 10px/1 ${font}`, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '6px 12px 6px', marginBottom: 2, color: t ? '#6C6D73' : '#93949D' }}>{sec.label}</div>}
              {sec.items.map(item => {
                const active = pathname === item.id;
                return (
                  <button key={item.id} onClick={() => router.push(item.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%', border: 0, borderRadius: 8, cursor: 'pointer', font: `${active ? 600 : 500} 13px/1 ${font}`, transition: 'background 150ms',
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    padding: sidebarCollapsed ? '10px' : '9px 12px',
                    background: active ? (t ? 'rgba(70,41,255,0.15)' : '#EDEBFF') : 'transparent',
                    color: active ? '#4629FF' : (t ? '#b9bac1' : '#343437'),
                  }}>
                    <NavIcon name={item.icon} active={active} t={t} />
                    {!sidebarCollapsed && <span>{item.name}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Theme toggle at bottom */}
        <div style={{ padding: '12px', borderTop: `1px solid ${t ? '#343437' : '#E9EAEC'}` }}>
          <button onClick={toggleTheme} style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%', border: 0, borderRadius: 8, cursor: 'pointer', font: `500 13px/1 ${font}`, background: 'transparent', transition: 'background 150ms',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            padding: sidebarCollapsed ? '10px' : '9px 12px',
            color: t ? '#b9bac1' : '#6C6D73',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              {t ? <><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></> : <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>}
            </svg>
            {!sidebarCollapsed && <span>{t ? 'Light mode' : 'Dark mode'}</span>}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <header style={{ height: 56, display: 'flex', alignItems: 'center', padding: '0 24px', borderBottom: `1px solid ${t ? '#343437' : '#E9EAEC'}`, flexShrink: 0, background: t ? '#1E1E20' : '#fff', transition: 'background 200ms' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ font: `500 13px/1 ${font}`, color: t ? '#6C6D73' : '#93949D' }}>{state.entity}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t ? '#434347' : '#CECED4'} strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            {/* Category Selector */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setCategoryOpen(!categoryOpen)} style={{ display: 'flex', alignItems: 'center', gap: 6, border: 0, background: 'transparent', cursor: 'pointer', font: `600 13px/1 ${font}`, color: fg1 }}>
                <span>{selectedCategoryName}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
              </button>
              {categoryOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 8, background: t ? '#1E1E20' : '#fff', borderRadius: 10, boxShadow: '0 4px 24px rgba(20,20,21,.16)', border: `1px solid ${t ? '#343437' : '#E9EAEC'}`, padding: 4, minWidth: 200, zIndex: 50 }}>
                  {categoryOptions.map(cat => (
                    <button key={cat.id} onClick={() => { setCategoryL0(cat.id); setCategoryL1('all'); setCategoryL2('all'); setCategoryOpen(false); }} style={{ display: 'block', width: '100%', textAlign: 'left', border: 0, padding: '8px 12px', borderRadius: 6, cursor: 'pointer', font: `500 12px/1.3 ${font}`, background: cat.id === state.categoryL0 ? (t ? 'rgba(70,41,255,0.15)' : '#EDEBFF') : 'transparent', color: cat.id === state.categoryL0 ? '#4629FF' : (t ? '#fff' : '#141415') }}>
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <CommandPalette />
            <NotificationPanel />
            <button
              onClick={togglePanel}
              style={{
                width: 34,
                height: 34,
                border: 0,
                background: catalystState.isOpen ? (t ? 'rgba(70,41,255,0.15)' : '#EDEBFF') : 'transparent',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 150ms',
              }}
              title="Cat-alyst AI Assistant"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={catalystState.isOpen ? '#4629FF' : (t ? '#b9bac1' : '#6C6D73')} strokeWidth="1.75">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#4629FF', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', font: `700 11px/1 ${font}`, flexShrink: 0 }}>CM</div>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
          {children}
        </div>
      </div>

      {/* Cat-alyst Panel */}
      {catalystState.isOpen && <CatalystPanel />}
    </div>
  );
}
