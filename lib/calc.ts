import { format } from 'date-fns';
import { Trade, TradeType, MonthlyStats, SymbolStats } from './types';

/**
 * Değişim yüzdesi hesapla (BUY/SELL yön duyarlı)
 * BUY için: ((exit - entry) / entry) * 100
 * SELL için: ((entry - exit) / entry) * 100
 * exit yoksa 0 döner
 */
export function calculateChangePct(type: TradeType, entry: number, exit?: number | null): number {
  if (!exit || exit === 0) return 0;
  
  if (type === 'BUY') {
    return ((exit - entry) / entry) * 100;
  } else {
    return ((entry - exit) / entry) * 100;
  }
}

/**
 * P&L miktarını USD cinsinden hesapla
 * TP = Kâr miktarı, SL = Zarar miktarı (direkt kullan)
 */
export function calculatePlAmount(
  type: TradeType, 
  entry: number, 
  exit: number | null | undefined, 
  volume: number,
  symbol: string,
  sl?: number | null,
  tp?: number | null
): number {
  if (!exit || exit === 0) return 0;
  
  // TP = Kâr miktarı, SL = Zarar miktarı
  // Hesaplama yapmaya gerek yok, direkt kullanıcının verdiği değerleri al
  
  if (tp && tp > 0) {
    // TP (kâr) değeri varsa, pozitif olarak döndür
    return tp;
  }
  
  if (sl && sl > 0) {
    // SL (zarar) değeri varsa, negatif olarak döndür
    return -sl;
  }
  
  // TP/SL yoksa, gerçek çıkış fiyatından hesapla
  let priceDiff: number;
  if (type === 'BUY') {
    priceDiff = exit - entry;
  } else {
    priceDiff = entry - exit;
  }
  
  const plAmount = priceDiff * volume;
  return Math.round(plAmount * 100) / 100;
}

/**
 * P&L işareti belirle
 */
export function getPlSign(changePct: number): '+' | '-' {
  return changePct >= 0 ? '+' : '-';
}

/**
 * Trade için monthKey türet (YYYY-MM formatında)
 */
export function getMonthKey(datetime: string): string {
  return format(new Date(datetime), 'yyyy-MM');
}

/**
 * Trade için günlük key türet (YYYY-MM-DD formatında)
 */
export function getDateKey(datetime: string): string {
  return format(new Date(datetime), 'yyyy-MM-dd');
}

/**
 * Trade'i hesaplanmış alanlarla birlikte oluştur
 */
export function createTradeWithCalculations(tradeData: Omit<Trade, 'monthKey' | 'changePct' | 'plPct' | 'plSign' | 'plAmount'>): Trade {
  const changePct = calculateChangePct(tradeData.type, tradeData.entry, tradeData.exit);
  const plAmount = calculatePlAmount(tradeData.type, tradeData.entry, tradeData.exit, tradeData.volume, tradeData.symbol, tradeData.sl, tradeData.tp);
  
  return {
    ...tradeData,
    monthKey: getMonthKey(tradeData.datetime),
    changePct,
    plPct: changePct, // Şimdilik aynı, swap dahil edilmedi
    plSign: getPlSign(changePct),
    plAmount
  };
}

/**
 * Trade'lerin aylık istatistiklerini hesapla
 * Sadece kapalı pozisyonları dahil eder (exit dolu olanlar)
 */
export function calculateMonthlyStats(trades: Trade[]): MonthlyStats {
  const closedTrades = trades.filter(t => t.exit !== null && t.exit !== undefined);
  
  if (closedTrades.length === 0) {
    return {
      monthKey: trades[0]?.monthKey || '',
      totalTrades: trades.length,
      winningTrades: 0,
      losingTrades: 0,
      totalPlPct: 0,
      totalVolume: 0,
      totalPlAmount: 0,
      totalProfitAmount: 0,
      totalLossAmount: 0
    };
  }
  
  const winningTrades = closedTrades.filter(t => t.changePct > 0);
  const losingTrades = closedTrades.filter(t => t.changePct < 0);
  
  // Hacim ağırlıklı ortalama P&L %
  const totalVolume = closedTrades.reduce((sum, t) => sum + t.volume, 0);
  const weightedSum = closedTrades.reduce((sum, t) => sum + (t.changePct * t.volume), 0);
  const totalPlPct = totalVolume > 0 ? weightedSum / totalVolume : 0;
  
  // P&L miktarları
  const totalPlAmount = closedTrades.reduce((sum, t) => sum + (t.plAmount || 0), 0);
  const totalProfitAmount = winningTrades.reduce((sum, t) => sum + (t.plAmount || 0), 0);
  const totalLossAmount = Math.abs(losingTrades.reduce((sum, t) => sum + (t.plAmount || 0), 0));
  
  return {
    monthKey: trades[0]?.monthKey || '',
    totalTrades: trades.length,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
    totalPlPct,
    totalVolume,
    totalPlAmount: Math.round(totalPlAmount * 100) / 100,
    totalProfitAmount: Math.round(totalProfitAmount * 100) / 100,
    totalLossAmount: Math.round(totalLossAmount * 100) / 100
  };
}

/**
 * Sembol bazında istatistikler hesapla
 */
export function calculateSymbolStats(trades: Trade[]): SymbolStats[] {
  const symbolMap = new Map<string, Trade[]>();
  
  // Sembole göre grupla
  trades.forEach(trade => {
    const existing = symbolMap.get(trade.symbol) || [];
    symbolMap.set(trade.symbol, [...existing, trade]);
  });
  
  const stats: SymbolStats[] = [];
  
  symbolMap.forEach((symbolTrades, symbol) => {
    const closedTrades = symbolTrades.filter(t => t.exit !== null && t.exit !== undefined);
    const winCount = closedTrades.filter(t => t.changePct > 0).length;
    const lossCount = closedTrades.filter(t => t.changePct < 0).length;
    
    // Hacim ağırlıklı ortalama P&L %
    const totalVolume = closedTrades.reduce((sum, t) => sum + t.volume, 0);
    const weightedSum = closedTrades.reduce((sum, t) => sum + (t.changePct * t.volume), 0);
    const avgPlPct = totalVolume > 0 ? weightedSum / totalVolume : 0;
    
    // P&L miktarı toplamı
    const totalPlAmount = closedTrades.reduce((sum, t) => sum + (t.plAmount || 0), 0);
    
    stats.push({
      symbol,
      tradeCount: symbolTrades.length,
      avgPlPct,
      winCount,
      lossCount,
      totalVolume,
      totalPlAmount: Math.round(totalPlAmount * 100) / 100
    });
  });
  
  // İşlem sayısına göre sırala (azalan)
  return stats.sort((a, b) => b.tradeCount - a.tradeCount);
}

/**
 * Win rate hesapla (kazanç oranı)
 * Sadece kapalı pozisyonları dahil eder
 */
export function calculateWinRate(trades: Trade[]): number {
  const closedTrades = trades.filter(t => t.exit !== null && t.exit !== undefined);
  if (closedTrades.length === 0) return 0;
  
  const winningTrades = closedTrades.filter(t => t.changePct > 0);
  return (winningTrades.length / closedTrades.length) * 100;
}

/**
 * Günlük kümülatif P&L serisini hesapla
 */
export function calculateDailyCumulativePL(trades: Trade[], monthKey: string): { date: string; cumulativePl: number }[] {
  // Seçili aya ait kapalı trade'leri filtrele
  const monthTrades = trades.filter(t => 
    t.monthKey === monthKey && 
    t.exit !== null && 
    t.exit !== undefined
  );
  
  if (monthTrades.length === 0) return [];
  
  // Günlere göre grupla
  const dailyMap = new Map<string, Trade[]>();
  monthTrades.forEach(trade => {
    const dateKey = getDateKey(trade.datetime);
    const existing = dailyMap.get(dateKey) || [];
    dailyMap.set(dateKey, [...existing, trade]);
  });
  
  // Günlük ortalama P&L hesapla ve kümülatif topla
  const dailyData: { date: string; cumulativePl: number }[] = [];
  let cumulativePl = 0;
  
  // Tarihe göre sırala
  const sortedDates = Array.from(dailyMap.keys()).sort();
  
  sortedDates.forEach(date => {
    const dayTrades = dailyMap.get(date)!;
    
    // Günlük hacim ağırlıklı ortalama
    const totalVolume = dayTrades.reduce((sum, t) => sum + t.volume, 0);
    const weightedSum = dayTrades.reduce((sum, t) => sum + (t.changePct * t.volume), 0);
    const dayAvgPl = totalVolume > 0 ? weightedSum / totalVolume : 0;
    
    cumulativePl += dayAvgPl;
    dailyData.push({ date, cumulativePl });
  });
  
  return dailyData;
}

/**
 * En çok işlem yapılan sembolü bul
 */
export function getMostTradedSymbol(trades: Trade[]): string | null {
  if (trades.length === 0) return null;
  
  const symbolCounts = new Map<string, number>();
  trades.forEach(trade => {
    symbolCounts.set(trade.symbol, (symbolCounts.get(trade.symbol) || 0) + 1);
  });
  
  let maxSymbol = '';
  let maxCount = 0;
  
  symbolCounts.forEach((count, symbol) => {
    if (count > maxCount || (count === maxCount && symbol < maxSymbol)) {
      maxSymbol = symbol;
      maxCount = count;
    }
  });
  
  return maxSymbol || null;
} 