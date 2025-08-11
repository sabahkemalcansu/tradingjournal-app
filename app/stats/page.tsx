'use client';

import { useEffect, useState } from 'react';
import { useTradeStore } from '@/store/trades';
import { tradeRepo } from '@/lib/repo';
import { Trade } from '@/lib/types';
import { calculateMonthlyStats, calculateSymbolStats } from '@/lib/calc';
import { formatPercent, formatVolume, formatMonthShort, formatUSD } from '@/lib/format';
import { KPICards } from '@/components/kpi-cards';
import { SymbolBarChart } from '@/components/charts/symbol-bar';
import { MonthlyPLLineChart } from '@/components/charts/monthly-pl-line';
import { BuySellPieChart } from '@/components/charts/buy-sell-pie';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';

export default function StatsPage() {
  const [allTrades, setAllTrades] = useState<Trade[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [monthKeys, setMonthKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [trades, months] = await Promise.all([
        tradeRepo.listAll(),
        tradeRepo.getMonthKeys()
      ]);
      
      setAllTrades(trades);
      
      // Ensure current month is included
      const currentMonth = format(new Date(), 'yyyy-MM');
      const allMonths = months.includes(currentMonth) 
        ? months 
        : [currentMonth, ...months];
      setMonthKeys(allMonths);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Seçili aya göre trade'leri filtrele
  const monthlyTrades = allTrades.filter(t => t.monthKey === selectedMonth);
  const monthlyStats = calculateMonthlyStats(monthlyTrades);
  const symbolStats = calculateSymbolStats(monthlyTrades);

  if (loading) {
    return (
      <div className="container py-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      {/* Başlık ve ay seçici */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">İstatistikler</h1>
          <p className="text-muted-foreground">
            Trading performansınızı analiz edin
          </p>
        </div>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ay seçiniz" />
          </SelectTrigger>
          <SelectContent>
            {monthKeys.map((monthKey) => (
              <SelectItem key={monthKey} value={monthKey}>
                {formatMonthShort(monthKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* KPI Kartları */}
      <KPICards trades={monthlyTrades} monthlyPlPct={monthlyStats.totalPlPct} />

      {/* Grafikler */}
      <div className="grid gap-6 md:grid-cols-2">
        <SymbolBarChart trades={monthlyTrades} />
        <MonthlyPLLineChart trades={allTrades} monthKey={selectedMonth} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <BuySellPieChart trades={monthlyTrades} />
        
        {/* Sembol bazında özet tablo */}
        <Card>
          <CardHeader>
            <CardTitle>Sembol Performansı</CardTitle>
            <CardDescription>Detaylı sembol istatistikleri</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sembol</TableHead>
                  <TableHead className="text-right">İşlem</TableHead>
                  <TableHead className="text-right">Ort. P&L</TableHead>
                  <TableHead className="text-right">Net P&L</TableHead>
                  <TableHead className="text-right">W/L</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {symbolStats.slice(0, 10).map((stat) => (
                  <TableRow key={stat.symbol}>
                    <TableCell className="font-medium">{stat.symbol}</TableCell>
                    <TableCell className="text-right">{stat.tradeCount}</TableCell>
                    <TableCell className="text-right">
                      <span className={stat.avgPlPct >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatPercent(stat.avgPlPct)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={stat.totalPlAmount >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatUSD(stat.totalPlAmount)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-green-600">{stat.winCount}</span>
                      {' / '}
                      <span className="text-red-600">{stat.lossCount}</span>
                    </TableCell>
                  </TableRow>
                ))}
                {symbolStats.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Henüz veri bulunmuyor
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 