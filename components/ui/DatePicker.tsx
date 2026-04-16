'use client';

import { useState } from 'react';

interface DateRangePickerProps {
  onChange?: (range: { start: Date; end: Date }) => void;
}

const PRESETS = [
  { label: 'Today', days: 0 },
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
];

export function DateRangePicker({ onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('Last 7 days');

  const handleSelect = (preset: typeof PRESETS[0]) => {
    setSelected(preset.label);
    setIsOpen(false);
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - preset.days);
    onChange?.({ start, end });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
      >
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {selected}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-40 z-50">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handleSelect(preset)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-dh-gray transition ${
                selected === preset.label ? 'text-dh-red font-medium' : 'text-gray-700'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}