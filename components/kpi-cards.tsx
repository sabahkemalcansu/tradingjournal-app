'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trade } from '@/lib/types';
import { getMostTradedSymbol, calculateWinRate, calculateMonthlyStats } from '@/lib/calc';
import { formatPercent, formatUSD } from '@/lib/format';
import { Trophy, Target, TrendingUp, Hash, DollarSign } from 'lucide-react';

interface KPICardsProps {
  trades: Trade[];
  monthlyPlPct: number;
}

export function KPICards({ trades, monthlyPlPct }: KPICardsProps) {
  const mostTradedSymbol = getMostTradedSymbol(trades);
  const winRate = calculateWinRate(trades);
  const totalTrades = trades.length;
  
  // Tüm trade'lerin net P&L'ini hesapla
  const allTradesStats = calculateMonthlyStats(trades);

  return (
    <div className="grid gap-4 md:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            En Çok İşlem
          </CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {mostTradedSymbol || 'Henüz yok'}
          </div>
          <p className="text-xs text-muted-foreground">
            En çok işlem yaptığınız sembol
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Toplam İşlem
          </CardTitle>
          <Hash className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTrades}</div>
          <p className="text-xs text-muted-foreground">
            Tüm zamanlar
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Toplam Net P&L
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${allTradesStats.totalPlAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatUSD(allTradesStats.totalPlAmount)}
          </div>
          <p className="text-xs text-muted-foreground">
            Tüm zamanlar net
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Aylık P&L %
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${monthlyPlPct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatPercent(monthlyPlPct)}
          </div>
          <p className="text-xs text-muted-foreground">
            Seçili ay için
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Kazanç Oranı
          </CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${winRate >= 50 ? 'text-green-600' : 'text-red-600'}`}>
            {formatPercent(winRate, false)}
          </div>
          <p className="text-xs text-muted-foreground">
            Win rate (kapalı işlemler)
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 