import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { Trade, TradeFilters } from './types';
import { createTradeWithCalculations, getDateKey } from './calc';

export const tradeRepo = {
  /**
   * Yeni trade ekle
   */
  async add(tradeData: Omit<Trade, 'id' | 'monthKey' | 'changePct' | 'plPct' | 'plSign' | 'plAmount'>): Promise<Trade> {
    const trade = createTradeWithCalculations({
      ...tradeData,
      id: uuidv4()
    });
    
    await db.trades.add(trade);
    return trade;
  },

  /**
   * Trade güncelle
   */
  async update(id: string, tradeData: Partial<Omit<Trade, 'id' | 'monthKey' | 'changePct' | 'plPct' | 'plSign' | 'plAmount'>>): Promise<Trade | null> {
    const existingTrade = await db.trades.get(id);
    if (!existingTrade) return null;
    
    const updatedData = {
      ...existingTrade,
      ...tradeData
    };
    
    const updatedTrade = createTradeWithCalculations(updatedData);
    await db.trades.update(id, updatedTrade);
    
    return updatedTrade;
  },

  /**
   * Trade sil
   */
  async delete(id: string): Promise<boolean> {
    const count = await db.trades.where('id').equals(id).delete();
    return count > 0;
  },

  /**
   * ID ile trade getir
   */
  async getById(id: string): Promise<Trade | null> {
    const trade = await db.trades.get(id);
    return trade || null;
  },

  /**
   * Aya göre trade'leri listele
   */
  async listByMonth(monthKey: string): Promise<Trade[]> {
    const trades = await db.trades
      .where('monthKey')
      .equals(monthKey)
      .toArray();
    
    return trades.sort((a, b) => 
      new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    );
  },

  /**
   * Tüm trade'leri listele
   */
  async listAll(): Promise<Trade[]> {
    const trades = await db.trades.toArray();
    return trades.sort((a, b) => 
      new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    );
  },

  /**
   * Filtrelere göre trade'leri listele
   */
  async listByFilters(filters: TradeFilters): Promise<Trade[]> {
    let collection = db.trades.toCollection();
    
    // Ay filtresi
    if (filters.monthKey) {
      collection = db.trades.where('monthKey').equals(filters.monthKey);
    }
    
    let trades = await collection.toArray();
    
    // Sembol filtresi
    if (filters.symbols && filters.symbols.length > 0) {
      trades = trades.filter(t => filters.symbols!.includes(t.symbol));
    }
    
    // Tip filtresi
    if (filters.type) {
      trades = trades.filter(t => t.type === filters.type);
    }
    
    // Sadece açık pozisyonlar
    if (filters.onlyOpen) {
      trades = trades.filter(t => !t.exit || t.exit === null);
    }
    
    // Günlük filtre
    if (filters.date) {
      trades = trades.filter(t => getDateKey(t.datetime) === filters.date);
    }
    
    return trades.sort((a, b) => 
      new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    );
  },

  /**
   * Benzersiz sembol listesi
   */
  async getUniqueSymbols(): Promise<string[]> {
    const trades = await db.trades.toArray();
    const symbols = new Set(trades.map(t => t.symbol));
    return Array.from(symbols).sort();
  },

  /**
   * Mevcut ay anahtarları
   */
  async getMonthKeys(): Promise<string[]> {
    const trades = await db.trades.toArray();
    const monthKeys = new Set(trades.map(t => t.monthKey));
    return Array.from(monthKeys).sort((a, b) => b.localeCompare(a));
  },

  /**
   * Toplu trade ekleme (import için)
   */
  async bulkAdd(trades: Omit<Trade, 'id' | 'monthKey' | 'changePct' | 'plPct' | 'plSign' | 'plAmount'>[]): Promise<Trade[]> {
    const processedTrades = trades.map(tradeData => 
      createTradeWithCalculations({
        ...tradeData,
        id: uuidv4()
      })
    );
    
    await db.trades.bulkAdd(processedTrades);
    return processedTrades;
  },

  /**
   * Veritabanını temizle
   */
  async clear(): Promise<void> {
    await db.trades.clear();
  }
}; 