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
    (async () => {
      try {
        const mod: any = await import('dexie-cloud-addon');
        // Paket default export eder; güvenli şekilde addon'u çıkar
        const addon = mod?.default ?? mod?.DexieCloud ?? mod?.DexieCloudAddon ?? mod;
        db.use(addon);
        // @ts-ignore - runtime eklenti API'si
        db.cloud.configure({
          databaseUrl: cloudUrl,
          requireAuth: false, // ihtiyaca göre true yapılabilir
        });
        // @ts-ignore
        db.cloud.sync().catch(() => {});
      } catch (e) {
        console.error('Dexie Cloud yüklenemedi:', e);
      }
    })();
  }
} 