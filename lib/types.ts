export type TradeType = 'BUY' | 'SELL';

export interface Trade {
  id: string;                // uuid
  symbol: string;            // "XAUUSD", "EURUSD" vb.
  datetime: string;          // ISO; Zaman
  type: TradeType;           // Tip
  volume: number;            // Hacim (lot)
  entry: number;             // Giriş Fiyatı
  exit?: number | null;      // Çıkış Fiyatı (opsiyonel; açık pozisyona izin ver)
  sl?: number | null;        // S/L
  tp?: number | null;        // T/P
  swap?: number | null;      // Swap (pozitif/negatif olabilir)
  notes?: string | null;     // Notlar

  // Türev/hesaplanan alanlar (persist ET):
  monthKey: string;          // "YYYY-MM" (datetime'dan türet)
  changePct: number;         // Değişim (%) — hesap mantığı aşağıda
  plPct: number;             // P&L (%) — changePct ile aynı
  plSign: '+' | '-';         // changePct >= 0 ? '+' : '-'
  plAmount: number;          // P&L miktarı USD cinsinden
}

export interface TradeFilters {
  symbols?: string[];
  type?: TradeType | null;
  onlyOpen?: boolean;
  monthKey?: string;
  date?: string;             // YYYY-MM-DD formatında günlük filtre
}

export interface MonthlyStats {
  monthKey: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  totalPlPct: number;        // Hacim ağırlıklı ortalama P&L %
  totalVolume: number;
  totalPlAmount: number;     // Net P&L miktarı USD
  totalProfitAmount: number; // Toplam kâr miktarı USD
  totalLossAmount: number;   // Toplam zarar miktarı USD
}

export interface SymbolStats {
  symbol: string;
  tradeCount: number;
  avgPlPct: number;
  winCount: number;
  lossCount: number;
  totalVolume: number;
  totalPlAmount: number;     // Net P&L miktarı USD
} 