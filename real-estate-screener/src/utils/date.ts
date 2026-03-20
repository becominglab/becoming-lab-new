import { format } from 'date-fns';

/** 今日の日付文字列 YYYY-MM-DD */
export function todayStr(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/** Date → YYYY-MM-DD */
export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/** YYYY-MM-DD → Date */
export function parseDate(dateStr: string): Date {
  return new Date(dateStr);
}
