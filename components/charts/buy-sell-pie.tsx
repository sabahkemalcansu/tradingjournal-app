'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trade } from '@/lib/types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BuySellPieChartProps {
  trades: Trade[];
}

const COLORS = {
  BUY: 'hsl(var(--primary))',
  SELL: 'hsl(var(--destructive))'
};

export function BuySellPieChart({ trades }: BuySellPieChartProps) {
  const buyCount = trades.filter(t => t.type === 'BUY').length;
  const sellCount = trades.filter(t => t.type === 'SELL').length;
  
  const data = [
    { name: 'BUY', value: buyCount },
    { name: 'SELL', value: sellCount }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>İşlem Tipi Dağılımı</CardTitle>
        <CardDescription>BUY vs SELL oranı</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
              labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 