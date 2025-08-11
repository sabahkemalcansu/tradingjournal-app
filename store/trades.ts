import { create } from 'zustand';
import { Trade, TradeFilters } from '@/lib/types';
import { tradeRepo } from '@/lib/repo';
import { format } from 'date-fns';

interface TradeStore {
  // State
  trades: Trade[];
  loading: boolean;
  error: string | null;
  monthKeys: string[];
  activeMonthKey: string;
  filters: TradeFilters;
  selectedDate: string | null;
  symbols: string[];
  
  // Actions
  loadTrades: () => Promise<void>;
  loadTradesByMonth: (monthKey: string) => Promise<void>;
  loadTradesByFilters: () => Promise<void>;
  addTrade: (tradeData: Omit<Trade, 'id' | 'monthKey' | 'changePct' | 'plPct' | 'plSign' | 'plAmount'>) => Promise<Trade | null>;
  updateTrade: (id: string, tradeData: Partial<Omit<Trade, 'id' | 'monthKey' | 'changePct' | 'plPct' | 'plSign' | 'plAmount'>>) => Promise<Trade | null>;
  deleteTrade: (id: string) => Promise<boolean>;
  setActiveMonth: (monthKey: string) => void;
  setFilters: (filters: Partial<TradeFilters>) => void;
  setSelectedDate: (date: string | null) => void;
  refreshMetadata: () => Promise<void>;
  clearError: () => void;
}

export const useTradeStore = create<TradeStore>((set, get) => ({
  // Initial state
  trades: [],
  loading: false,
  error: null,
  monthKeys: [],
  activeMonthKey: format(new Date(), 'yyyy-MM'),
  filters: {},
  selectedDate: null,
  symbols: [],
  
  // Load all trades
  loadTrades: async () => {
    set({ loading: true, error: null });
    try {
      const trades = await tradeRepo.listAll();
      set({ trades, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  // Load trades by month
  loadTradesByMonth: async (monthKey: string) => {
    set({ loading: true, error: null });
    try {
      const trades = await tradeRepo.listByMonth(monthKey);
      set({ trades, loading: false, activeMonthKey: monthKey });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  // Load trades by filters
  loadTradesByFilters: async () => {
    set({ loading: true, error: null });
    try {
      const { filters, activeMonthKey, selectedDate } = get();
      const appliedFilters: TradeFilters = {
        ...filters,
        monthKey: activeMonthKey,
        date: selectedDate || undefined
      };
      
      const trades = await tradeRepo.listByFilters(appliedFilters);
      set({ trades, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  // Add new trade
  addTrade: async (tradeData) => {
    set({ loading: true, error: null });
    try {
      const trade = await tradeRepo.add(tradeData);
      
      // Refresh trades and metadata
      const { activeMonthKey } = get();
      await get().loadTradesByMonth(activeMonthKey);
      await get().refreshMetadata();
      
      set({ loading: false });
      return trade;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      return null;
    }
  },
  
  // Update trade
  updateTrade: async (id, tradeData) => {
    set({ loading: true, error: null });
    try {
      const trade = await tradeRepo.update(id, tradeData);
      
      if (trade) {
        // Refresh trades
        const { activeMonthKey } = get();
        await get().loadTradesByMonth(activeMonthKey);
        await get().refreshMetadata();
      }
      
      set({ loading: false });
      return trade;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      return null;
    }
  },
  
  // Delete trade
  deleteTrade: async (id) => {
    set({ loading: true, error: null });
    try {
      const success = await tradeRepo.delete(id);
      
      if (success) {
        // Refresh trades
        const { activeMonthKey } = get();
        await get().loadTradesByMonth(activeMonthKey);
        await get().refreshMetadata();
      }
      
      set({ loading: false });
      return success;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      return false;
    }
  },
  
  // Set active month
  setActiveMonth: (monthKey: string) => {
    set({ activeMonthKey: monthKey });
    get().loadTradesByMonth(monthKey);
  },
  
  // Set filters
  setFilters: (filters: Partial<TradeFilters>) => {
    set(state => ({ filters: { ...state.filters, ...filters } }));
    get().loadTradesByFilters();
  },
  
  // Set selected date
  setSelectedDate: (date: string | null) => {
    set({ selectedDate: date });
    get().loadTradesByFilters();
  },
  
  // Refresh metadata (month keys, symbols)
  refreshMetadata: async () => {
    try {
      const [monthKeys, symbols] = await Promise.all([
        tradeRepo.getMonthKeys(),
        tradeRepo.getUniqueSymbols()
      ]);
      
      // Ensure current month is included
      const currentMonth = format(new Date(), 'yyyy-MM');
      if (!monthKeys.includes(currentMonth)) {
        monthKeys.unshift(currentMonth);
      }
      
      set({ monthKeys, symbols });
    } catch (error) {
      console.error('Failed to refresh metadata:', error);
    }
  },
  
  // Clear error
  clearError: () => {
    set({ error: null });
  }
})); 