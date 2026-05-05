import Papa from 'papaparse';

export function toCsv<T extends Record<string, unknown>>(rows: T[], columns?: string[]) {
  return Papa.unparse(rows, { columns });
}
