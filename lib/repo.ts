import { v4 as uuidv4 } from 'uuid';
import { Trade, TradeFilters } from './types';
import { createTradeWithCalculations, getDateKey } from './calc';
import { getSupabaseBrowserClient } from './supabase';

// Geçici: Dexie yerine Supabase'e geçiş için temel şablon
export const tradeRepo = {
  async add(tradeData: Omit<Trade, 'id' | 'monthKey' | 'changePct' | 'plPct' | 'plSign' | 'plAmount'>): Promise<Trade> {
    const supabase = getSupabaseBrowserClient();
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) throw new Error('Önce giriş yapmalısınız');

    const trade = createTradeWithCalculations({
      ...tradeData,
      id: uuidv4()
    });

    const { error } = await supabase.from('trades').insert({ ...trade, user_id: sessionData.session.user.id });
    if (error) throw error;
    return trade;
  },

  async update(id: string, tradeData: Partial<Omit<Trade, 'id' | 'monthKey' | 'changePct' | 'plPct' | 'plSign' | 'plAmount'>>): Promise<Trade | null> {
    const supabase = getSupabaseBrowserClient();
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) throw new Error('Önce giriş yapmalısınız');

    // Supabase tarafında upsert
    const merged = { id, ...(tradeData as any) } as any;
    const updated = createTradeWithCalculations(merged as any);
    const { error } = await supabase.from('trades').update(updated).eq('id', id);
    if (error) throw error;
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    const supabase = getSupabaseBrowserClient();
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) throw new Error('Önce giriş yapmalısınız');

    const { error } = await supabase.from('trades').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async getById(id: string) {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.from('trades').select('*').eq('id', id).single();
    if (error) return null;
    return data as Trade;
  },

  async listByMonth(monthKey: string): Promise<Trade[]> {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('monthKey', monthKey)
      .order('datetime', { ascending: false });
    if (error) throw error;
    return (data as Trade[]) || [];
  },

  async listAll(): Promise<Trade[]> {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .order('datetime', { ascending: false });
    if (error) throw error;
    return (data as Trade[]) || [];
  },

  async listByFilters(filters: TradeFilters): Promise<Trade[]> {
    const supabase = getSupabaseBrowserClient();
    let query = supabase.from('trades').select('*');

    if (filters.monthKey) query = query.eq('monthKey', filters.monthKey);
    const { data, error } = await query;
    if (error) throw error;
    let trades = (data as Trade[]) || [];

    if (filters.symbols && filters.symbols.length > 0) {
      trades = trades.filter(t => filters.symbols!.includes(t.symbol));
    }
    if (filters.type) trades = trades.filter(t => t.type === filters.type);
    if (filters.onlyOpen) trades = trades.filter(t => !t.exit);
    if (filters.date) trades = trades.filter(t => getDateKey(t.datetime) === filters.date);

    return trades.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
  },

  async getUniqueSymbols(): Promise<string[]> {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.from('trades').select('symbol');
    if (error) throw error;
    const symbols = new Set((data as any[]).map(r => r.symbol));
    return Array.from(symbols).sort();
  },

  async getMonthKeys(): Promise<string[]> {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.from('trades').select('monthKey');
    if (error) throw error;
    const keys = new Set((data as any[]).map(r => r.monthKey));
    return Array.from(keys).sort((a, b) => b.localeCompare(a));
  },

  async bulkAdd(list: Omit<Trade, 'id' | 'monthKey' | 'changePct' | 'plPct' | 'plSign' | 'plAmount'>[]): Promise<Trade[]> {
    const supabase = getSupabaseBrowserClient();
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) throw new Error('Önce giriş yapmalısınız');

    const processed = list.map(tradeData => createTradeWithCalculations({ ...tradeData, id: uuidv4() }));
    const payload = processed.map(t => ({ ...t, user_id: sessionData.session!.user.id }));
    const { error } = await supabase.from('trades').insert(payload);
    if (error) throw error;
    return processed;
  },

  async clear(): Promise<void> {
    const supabase = getSupabaseBrowserClient();
    await supabase.from('trades').delete().neq('id', '');
  }
}; 