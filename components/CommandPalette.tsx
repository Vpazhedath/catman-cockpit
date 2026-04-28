'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/lib/ThemeContext';

interface Command {
  id: string;
  title: string;
  category: string;
  shortcut?: string;
  icon: string;
  action: () => void;
}

const font = 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { theme } = useTheme();
  const t = theme === 'dark';

  const commands: Command[] = useMemo(() => [
    // Navigation
    { id: 'nav-performance', title: 'Go to Category Pulse', category: 'Navigation', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', action: () => router.push('/') },
    { id: 'nav-sku-tower', title: 'Go to SKU Control Tower', category: 'Navigation', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', action: () => router.push('/sku-tower') },
    { id: 'nav-assortment', title: 'Go to Choice', category: 'Navigation', icon: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z', action: () => router.push('/assortment') },
    { id: 'nav-price', title: 'Go to Affordability', category: 'Navigation', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', action: () => router.push('/price') },
    { id: 'nav-lifecycle', title: 'Go to Lifecycle', category: 'Navigation', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', action: () => router.push('/lifecycle') },
    { id: 'nav-profitability', title: 'Go to Profitability', category: 'Navigation', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', action: () => router.push('/profitability') },
    { id: 'nav-settings', title: 'Go to Settings', category: 'Navigation', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', action: () => router.push('/settings') },
    // Actions
    { id: 'action-export', title: 'Export Current View', category: 'Actions', shortcut: '⌘D', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4', action: () => {} },
    // SKUs
    { id: 'sku-almarai', title: 'Almarai Full Cream 1L', category: 'SKUs', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', action: () => router.push('/sku-tower') },
    { id: 'sku-nestle', title: 'Nestle Pure Life 1.5L', category: 'SKUs', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', action: () => router.push('/sku-tower') },
  ], [router]);

  const filteredCommands = useMemo(() => {
    if (!search) return commands;
    const lowerSearch = search.toLowerCase();
    return commands.filter(cmd =>
      cmd.title.toLowerCase().includes(lowerSearch) ||
      cmd.category.toLowerCase().includes(lowerSearch)
    );
  }, [commands, search]);

  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {};
    filteredCommands.forEach(cmd => {
      if (!groups[cmd.category]) groups[cmd.category] = [];
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearch('');
      }
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1));
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(i => Math.max(i - 1, 0));
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          const cmd = filteredCommands[selectedIndex];
          if (cmd) {
            cmd.action();
            setIsOpen(false);
            setSearch('');
          }
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Colors based on theme
  const fg1 = t ? '#fff' : '#141415';
  const fg2 = t ? '#b9bac1' : '#6C6D73';
  const fg3 = t ? '#6C6D73' : '#93949D';
  const surfPrimary = t ? '#1E1E20' : '#fff';
  const surfSecondary = t ? '#343437' : '#F4F5F6';
  const border = t ? '#343437' : '#E9EAEC';

  // Trigger button in header
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '7px 12px',
          borderRadius: 8,
          border: `1px solid ${t ? '#434347' : '#E9EAEC'}`,
          background: t ? '#343437' : '#F4F5F6',
          cursor: 'pointer',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={fg3} strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <span style={{ font: `500 12px/1 ${font}`, color: fg3 }}>Search…</span>
        <span style={{ font: `500 10px/1 ${font}`, color: fg3, background: t ? '#434347' : '#E9EAEC', padding: '2px 6px', borderRadius: 4 }}>⌘K</span>
      </button>
    );
  }

  // Full modal
  return (
    <div
      onClick={() => { setIsOpen(false); setSearch(''); }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 100,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: surfPrimary,
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.24)',
          width: '100%',
          maxWidth: 560,
          overflow: 'hidden',
        }}
      >
        {/* Search Input */}
        <div style={{ padding: 16, borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={fg3} strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search commands, pages, SKUs..."
            style={{ flex: 1, background: 'transparent', border: 0, outline: 'none', font: `500 16px/1 ${font}`, color: fg1 }}
          />
          <span style={{ font: `500 11px/1 ${font}`, color: fg3, background: surfSecondary, padding: '4px 8px', borderRadius: 4 }}>ESC</span>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 360, overflowY: 'auto', padding: 8 }}>
          {Object.entries(groupedCommands).map(([category, cmds]) => (
            <div key={category} style={{ marginBottom: 8 }}>
              <p style={{ font: `600 10px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '8px 12px 6px' }}>{category}</p>
              {cmds.map(cmd => {
                const globalIndex = filteredCommands.indexOf(cmd);
                const isSelected = globalIndex === selectedIndex;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => { cmd.action(); setIsOpen(false); setSearch(''); }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: 0,
                      cursor: 'pointer',
                      background: isSelected ? '#4629FF' : 'transparent',
                      color: isSelected ? '#fff' : fg1,
                      font: `500 13px/1 ${font}`,
                      textAlign: 'left' as const,
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isSelected ? '#fff' : fg3} strokeWidth="1.75">
                      <path strokeLinecap="round" strokeLinejoin="round" d={cmd.icon} />
                    </svg>
                    <span style={{ flex: 1 }}>{cmd.title}</span>
                    {cmd.shortcut && (
                      <span style={{ font: `500 10px/1 ${font}`, color: isSelected ? 'rgba(255,255,255,0.7)' : fg3, background: isSelected ? 'rgba(255,255,255,0.2)' : surfSecondary, padding: '2px 6px', borderRadius: 4 }}>
                        {cmd.shortcut}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
          {filteredCommands.length === 0 && (
            <div style={{ textAlign: 'center', padding: 32, color: fg2 }}>
              <p style={{ font: `500 14px/1 ${font}` }}>No results for "{search}"</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 16px', borderTop: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: 16, font: `500 11px/1 ${font}`, color: fg3 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ background: surfSecondary, padding: '2px 6px', borderRadius: 4 }}>↑</span>
            <span style={{ background: surfSecondary, padding: '2px 6px', borderRadius: 4 }}>↓</span>
            Navigate
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ background: surfSecondary, padding: '2px 6px', borderRadius: 4 }}>↵</span>
            Select
          </span>
        </div>
      </div>
    </div>
  );
}