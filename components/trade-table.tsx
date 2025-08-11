'use client';

import { Trade } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash } from 'lucide-react';
import {
  formatDateTime,
  formatPrice,
  formatVolume,
  formatPercent,
  formatCurrency,
  formatUSD,
} from '@/lib/format';
import { cn } from '@/lib/utils';

interface TradeTableProps {
  trades: Trade[];
  onEdit: (trade: Trade) => void;
  onDelete: (trade: Trade) => void;
}

export function TradeTable({ trades, onEdit, onDelete }: TradeTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sembol</TableHead>
            <TableHead>Zaman</TableHead>
            <TableHead>Tip</TableHead>
            <TableHead className="text-right">Hacim</TableHead>
            <TableHead className="text-right">Giriş Fiyatı</TableHead>
            <TableHead className="text-right">Çıkış Fiyatı</TableHead>
            <TableHead className="text-right">Zarar ($)</TableHead>
            <TableHead className="text-right">Kâr ($)</TableHead>
            <TableHead className="text-right">Swap</TableHead>
            <TableHead className="text-right">Değişim (%)</TableHead>
            <TableHead className="text-right">P&L ($)</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.length === 0 ? (
            <TableRow>
              <TableCell colSpan={12} className="text-center text-muted-foreground">
                Henüz işlem bulunmuyor
              </TableCell>
            </TableRow>
          ) : (
            trades.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell className="font-medium">{trade.symbol}</TableCell>
                <TableCell>{formatDateTime(trade.datetime)}</TableCell>
                <TableCell>
                  <Badge
                    variant={trade.type === 'BUY' ? 'default' : 'destructive'}
                  >
                    {trade.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {formatVolume(trade.volume)}
                </TableCell>
                <TableCell className="text-right">
                  {formatPrice(trade.entry, trade.symbol)}
                </TableCell>
                <TableCell className="text-right">
                  {trade.exit ? (
                    formatPrice(trade.exit, trade.symbol)
                  ) : (
                    <Badge variant="secondary">Açık</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {formatPrice(trade.sl, trade.symbol)}
                </TableCell>
                <TableCell className="text-right">
                  {formatPrice(trade.tp, trade.symbol)}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={cn(
                      trade.swap && trade.swap < 0 && 'text-destructive'
                    )}
                  >
                    {formatCurrency(trade.swap)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {trade.exit ? (
                    <Badge
                      variant={trade.changePct >= 0 ? 'default' : 'destructive'}
                      className={cn(
                        trade.changePct >= 0
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'bg-red-500 hover:bg-red-600'
                      )}
                    >
                      {formatPercent(trade.changePct)}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      0.00%
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {trade.exit ? (
                    <span
                      className={cn(
                        'font-medium',
                        trade.plAmount >= 0 ? 'text-green-600' : 'text-red-600'
                      )}
                    >
                      {formatUSD(trade.plAmount)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">$0.00</span>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Menüyü aç</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(trade)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Düzenle
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(trade)}
                        className="text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
} 