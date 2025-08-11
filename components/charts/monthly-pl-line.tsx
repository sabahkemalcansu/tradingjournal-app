'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trade } from '@/lib/types';
import { calculateDailyCumulativePL } from '@/lib/calc';
import { formatPercent } from '@/lib/format';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface MonthlyPLLineChartProps {
  trades: Trade[];
  monthKey: string;
}

export function MonthlyPLLineChart({ trades, monthKey }: MonthlyPLLineChartProps) {
  const data = calculateDailyCumulativePL(trades, monthKey);
  
  const formattedData = data.map(item => ({
    ...item,
    date: format(new Date(item.date), 'dd MMM', { locale: tr })
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Günlük Kümülatif P&L</CardTitle>
        <CardDescription>Seçili aydaki günlük performans trendi</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date"
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'currentColor' }}
              tickFormatter={(value) => `${value.toFixed(2)}%`}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
              labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
              formatter={(value: number) => formatPercent(value)}
            />
            <Line
              type="monotone"
              dataKey="cumulativePl"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              activeDot={{ r: 6 }}
              name="Kümülatif P&L %"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 