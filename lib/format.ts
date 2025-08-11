import numeral from 'numeral';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

/**
 * Sayıyı formatla (ondalık basamaklar dahil)
 */
export function formatNumber(value: number | null | undefined, decimals: number = 4): string {
  if (value === null || value === undefined) return '-';
  
  const formatString = '0,0.' + '0'.repeat(decimals);
  return numeral(value).format(formatString);
}

/**
 * Yüzde değeri formatla
 */
export function formatPercent(value: number | null | undefined, showSign: boolean = true): string {
  if (value === null || value === undefined) return '0.00%';
  
  const formatted = numeral(Math.abs(value)).format('0,0.00');
  
  if (showSign && value !== 0) {
    const sign = value > 0 ? '+' : '-';
    return `${sign}${formatted}%`;
  }
  
  return `${formatted}%`;
}

/**
 * Para birimi formatla (Swap için)
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return '$0.00';
  
  const formatted = numeral(Math.abs(value)).format('0,0.00');
  const sign = value < 0 ? '-' : '';
  return `${sign}$${formatted}`;
}

/**
 * USD miktarı formatla (P&L için)
 */
export function formatUSD(value: number | null | undefined, showSign: boolean = true): string {
  if (value === null || value === undefined) return '$0.00';
  
  const formatted = numeral(Math.abs(value)).format('0,0.00');
  
  if (showSign && value !== 0) {
    const sign = value > 0 ? '+' : '-';
    return `${sign}$${formatted}`;
  }
  
  return `$${formatted}`;
}

/**
 * Lot (hacim) formatla
 */
export function formatVolume(value: number | null | undefined): string {
  if (value === null || value === undefined) return '0.00';
  return numeral(value).format('0,0.00');
}

/**
 * Tarih ve saat formatla
 */
export function formatDateTime(datetime: string | Date, formatStr: string = 'dd MMM yyyy HH:mm'): string {
  const date = typeof datetime === 'string' ? parseISO(datetime) : datetime;
  return format(date, formatStr, { locale: tr });
}

/**
 * Sadece tarih formatla
 */
export function formatDate(datetime: string | Date): string {
  return formatDateTime(datetime, 'dd MMM yyyy');
}

/**
 * Sadece saat formatla
 */
export function formatTime(datetime: string | Date): string {
  return formatDateTime(datetime, 'HH:mm');
}

/**
 * Ay adı formatla
 */
export function formatMonthYear(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return format(date, 'MMMM yyyy', { locale: tr });
}

/**
 * Kısa ay adı formatla
 */
export function formatMonthShort(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return format(date, 'MMM yyyy', { locale: tr });
}

/**
 * Fiyat formatla (sembol tipine göre ondalık ayarla)
 */
export function formatPrice(value: number | null | undefined, symbol?: string): string {
  if (value === null || value === undefined) return '-';
  
  // Sembol bazında özel formatlama (opsiyonel)
  let decimals = 5;
  if (symbol) {
    if (symbol.includes('JPY')) {
      decimals = 3;
    } else if (symbol.includes('XAU') || symbol.includes('XAG')) {
      decimals = 2;
    }
  }
  
  return formatNumber(value, decimals);
} 