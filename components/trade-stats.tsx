'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trade } from '@/lib/types';
import { calculateMonthlyStats } from '@/lib/calc';
import { formatPercent, formatUSD } from '@/lib/format';
import { TrendingUp, TrendingDown, Activity, PieChart, DollarSign, Target } from 'lucide-react';

interface TradeStatsProps {
  trades: Trade[];
}

export function TradeStats({ trades }: TradeStatsProps) {
  const stats = calculateMonthlyStats(trades);

  return (
    <div className="grid gap-4 md:grid-cols-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Toplam İşlem
          </CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTrades}</div>
          <p className="text-xs text-muted-foreground">
            Bu aydaki işlem sayısı
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Kazanan İşlem
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.winningTrades}</div>
          <p className="text-xs text-muted-foreground">
            Pozitif P&L işlemler
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Kaybeden İşlem
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.losingTrades}</div>
          <p className="text-xs text-muted-foreground">
            Negatif P&L işlemler
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Toplam Kâr
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatUSD(stats.totalProfitAmount, false)}
          </div>
          <p className="text-xs text-muted-foreground">
            Kazanılan miktar
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Toplam Zarar
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatUSD(stats.totalLossAmount, false)}
          </div>
          <p className="text-xs text-muted-foreground">
            Kaybedilen miktar
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Net P&L
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${stats.totalPlAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatUSD(stats.totalPlAmount)}
          </div>
          <p className="text-xs text-muted-foreground">
            Net kazanç/kayıp
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 