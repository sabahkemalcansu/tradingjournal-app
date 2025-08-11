'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trade } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SymbolBarChartProps {
  trades: Trade[];
}

export function SymbolBarChart({ trades }: SymbolBarChartProps) {
  // Sembole göre işlem sayısını hesapla
  const symbolCounts = trades.reduce((acc, trade) => {
    acc[trade.symbol] = (acc[trade.symbol] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(symbolCounts)
    .map(([symbol, count]) => ({ symbol, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // En çok 10 sembol göster

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sembole Göre İşlem Sayısı</CardTitle>
        <CardDescription>En çok işlem yapılan semboller</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="symbol" 
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
              labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
            />
            <Bar 
              dataKey="count" 
              fill="hsl(var(--primary))" 
              radius={[8, 8, 0, 0]}
              name="İşlem Sayısı"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 