'use client';

import { useState, useRef, useEffect } from 'react';

const font = 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)';

interface ExportOption {
  label: string;
  format: 'csv' | 'xlsx';
}

const exportOptions: ExportOption[] = [
  { label: 'Export as CSV', format: 'csv' },
  { label: 'Export as Excel', format: 'xlsx' },
];

interface ExportButtonProps {
  onExport: (format: 'csv' | 'xlsx') => void;
  isDark: boolean;
}

export function ExportButton({ onExport, isDark }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fg2 = isDark ? '#b9bac1' : '#6C6D73';
  const borderColor = isDark ? '#343437' : '#E9EAEC';
  const hoverBg = isDark ? '#343437' : '#F4F5F6';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '7px 14px',
          borderRadius: 8,
          cursor: 'pointer',
          border: `1px solid ${borderColor}`,
          background: 'transparent',
          color: fg2,
          font: `600 12px/1 ${font}`,
          transition: 'background-color 0.15s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = hoverBg}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7,10 12,15 17,10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Export
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 4,
            background: isDark ? '#1E1E20' : '#fff',
            border: `1px solid ${borderColor}`,
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: 160,
            zIndex: 50,
            overflow: 'hidden',
          }}
        >
          {exportOptions.map((option) => (
            <button
              key={option.format}
              onClick={() => {
                onExport(option.format);
                setIsOpen(false);
              }}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px 14px',
                textAlign: 'left',
                border: 'none',
                background: 'transparent',
                color: isDark ? '#fff' : '#141415',
                font: `500 13px/1 ${font}`,
                cursor: 'pointer',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = hoverBg}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}