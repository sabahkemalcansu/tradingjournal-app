import Dexie, { Table } from 'dexie';
import { Trade } from './types';

export class TradingJournalDB extends Dexie {
  trades!: Table<Trade>;

  constructor() {
    super('TradingJournalDB');
    this.version(1).stores({
      trades: 'id, symbol, datetime, monthKey, type, [monthKey+symbol], [monthKey+type]'
    });
  }
}

export const db = new TradingJournalDB(); 