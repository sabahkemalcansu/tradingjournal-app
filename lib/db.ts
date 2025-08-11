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

// Dexie Cloud entegrasyonu (opsiyonel)
if (typeof window !== 'undefined') {
  const cloudUrl = process.env.NEXT_PUBLIC_DEXIE_CLOUD_URL;
  if (cloudUrl) {
    // Dinamik import ile addon'u yalnızca istemci tarafında yükle
    import('dexie-cloud-addon').then(({ DexieCloudAddon }) => {
      db.use(DexieCloudAddon);
      // @ts-ignore - runtime config
      db.cloud.configure({
        databaseUrl: cloudUrl,
        requireAuth: false, // Gerekirse e-posta kimlik doğrulaması açılır
      });
      // İlk sync (sessiz)
      // @ts-ignore
      db.cloud.sync().catch(() => {});
    }).catch((e) => {
      console.error('Dexie Cloud yüklenemedi:', e);
    });
  }
} 