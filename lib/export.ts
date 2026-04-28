import * as XLSX from 'xlsx';

export interface ExportColumn<T> {
  header: string;
  key: keyof T | string;
  formatter?: (value: unknown, row: T) => string | number;
}

/**
 * Export data to CSV or Excel format
 */
export function exportData<T extends object>(
  data: T[],
  columns: ExportColumn<T>[],
  filename: string,
  format: 'csv' | 'xlsx'
): void {
  // Transform data into rows based on column definitions
  const rows = data.map(row => {
    const rowData: Record<string, string | number> = {};
    columns.forEach(col => {
      const key = String(col.key);
      const value = key.includes('.')
        ? getNestedValue(row, key)
        : row[col.key as keyof T];
      rowData[col.header] = col.formatter
        ? col.formatter(value, row)
        : formatValue(value);
    });
    return rowData;
  });

  const headers = columns.map(c => c.header);
  const worksheetData = [headers, ...rows.map(r => headers.map(h => r[h]))];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Export');

  if (format === 'csv') {
    XLSX.writeFile(workbook, `${filename}.csv`, { bookType: 'csv' });
  } else {
    XLSX.writeFile(workbook, `${filename}.xlsx`, { bookType: 'xlsx' });
  }
}

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce((acc: unknown, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}

function formatValue(value: unknown): string | number {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number') return value;
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
}

/**
 * Generate filename with date suffix
 */
export function generateFilename(pageName: string): string {
  const date = new Date().toISOString().split('T')[0];
  return `${pageName}-${date}`;
}