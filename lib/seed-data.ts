import { tradeRepo } from './repo';
import { format, subDays, subHours } from 'date-fns';

const symbols = ['XAUUSD', 'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD'];
const types: ('BUY' | 'SELL')[] = ['BUY', 'SELL'];

function randomBetween(min: number, max: number, decimals: number = 2) {
  return Number((Math.random() * (max - min) + min).toFixed(decimals));
}

export async function seedDemoData() {
  const trades = [];
  const now = new Date();
  
  // Son 30 günde 20 örnek işlem oluştur
  for (let i = 0; i < 20; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const datetime = format(
      subHours(subDays(now, daysAgo), hoursAgo),
      "yyyy-MM-dd'T'HH:mm"
    );
    
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const volume = randomBetween(0.01, 0.5, 2);
    
    // Sembol tipine göre fiyat aralıkları
    let entry: number;
    let exit: number | undefined;
    let sl: number | undefined;
    let tp: number | undefined;
    
    if (symbol === 'XAUUSD') {
      entry = randomBetween(2000, 2100, 2);
      if (Math.random() > 0.3) { // %70 kapalı pozisyon
        const change = randomBetween(-30, 30, 2);
        exit = entry + change;
      }
      if (Math.random() > 0.5) {
        sl = type === 'BUY' ? entry - randomBetween(10, 30, 2) : entry + randomBetween(10, 30, 2);
      }
      if (Math.random() > 0.5) {
        tp = type === 'BUY' ? entry + randomBetween(10, 50, 2) : entry - randomBetween(10, 50, 2);
      }
    } else if (symbol.includes('JPY')) {
      entry = randomBetween(140, 150, 3);
      if (Math.random() > 0.3) {
        const change = randomBetween(-2, 2, 3);
        exit = entry + change;
      }
      if (Math.random() > 0.5) {
        sl = type === 'BUY' ? entry - randomBetween(0.5, 2, 3) : entry + randomBetween(0.5, 2, 3);
      }
      if (Math.random() > 0.5) {
        tp = type === 'BUY' ? entry + randomBetween(0.5, 3, 3) : entry - randomBetween(0.5, 3, 3);
      }
    } else {
      entry = randomBetween(1.0, 1.5, 5);
      if (Math.random() > 0.3) {
        const change = randomBetween(-0.01, 0.01, 5);
        exit = entry + change;
      }
      if (Math.random() > 0.5) {
        sl = type === 'BUY' ? entry - randomBetween(0.005, 0.02, 5) : entry + randomBetween(0.005, 0.02, 5);
      }
      if (Math.random() > 0.5) {
        tp = type === 'BUY' ? entry + randomBetween(0.005, 0.03, 5) : entry - randomBetween(0.005, 0.03, 5);
      }
    }
    
    const swap = Math.random() > 0.5 ? randomBetween(-5, 5, 2) : undefined;
    
    trades.push({
      symbol,
      datetime,
      type,
      volume,
      entry,
      exit,
      sl,
      tp,
      swap,
      notes: Math.random() > 0.7 ? 'Demo işlem notu' : undefined
    });
  }
  
  // İşlemleri ekle
  await tradeRepo.bulkAdd(trades);
  
  return trades.length;
} 