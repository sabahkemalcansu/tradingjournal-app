'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Trade } from '@/lib/types';
import { tradeFormSchema, TradeFormData } from '@/lib/validations';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface TradeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trade?: Trade | null;
  onSubmit: (data: TradeFormData) => Promise<void>;
}

// Popüler forex sembolleri
const POPULAR_SYMBOLS = [
  'XAUUSD',
  'EURUSD',
  'GBPUSD',
  'USDJPY',
  'USDCHF',
  'AUDUSD',
  'USDCAD',
  'NZDUSD',
  'EURGBP',
  'EURJPY',
  'GBPJPY',
  'XAGUSD',
];

export function TradeFormDialog({
  open,
  onOpenChange,
  trade,
  onSubmit,
}: TradeFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<TradeFormData>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues: {
      symbol: '',
      datetime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      type: 'BUY',
      volume: 0.01,
      entry: undefined,
      exit: undefined,
      sl: undefined,
      tp: undefined,
      swap: undefined,
      notes: '',
    },
  });

  // Trade düzenleme modunda form'u doldur
  useEffect(() => {
    if (trade) {
      form.reset({
        symbol: trade.symbol,
        datetime: trade.datetime,
        type: trade.type,
        volume: trade.volume,
        entry: trade.entry,
        exit: trade.exit || undefined,
        sl: trade.sl || undefined,
        tp: trade.tp || undefined,
        swap: trade.swap || undefined,
        notes: trade.notes || '',
      });
    } else {
      form.reset({
        symbol: '',
        datetime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        type: 'BUY',
        volume: 0.01,
        entry: undefined,
        exit: undefined,
        sl: undefined,
        tp: undefined,
        swap: undefined,
        notes: '',
      });
    }
  }, [trade, form]);

  const handleSubmit = async (data: TradeFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast({
        title: 'Başarılı',
        description: trade ? 'İşlem güncellendi' : 'İşlem eklendi',
      });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'İşlem kaydedilemedi',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{trade ? 'İşlem Düzenle' : 'Yeni İşlem'}</DialogTitle>
          <DialogDescription>
            {trade
              ? 'İşlem detaylarını güncelleyin'
              : 'Yeni bir forex işlemi ekleyin'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sembol</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="XAUUSD"
                        {...field}
                        list="symbols"
                        className="uppercase"
                      />
                    </FormControl>
                    <datalist id="symbols">
                      {POPULAR_SYMBOLS.map((symbol) => (
                        <option key={symbol} value={symbol} />
                      ))}
                    </datalist>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="datetime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tarih ve Saat</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İşlem Tipi</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Tip seçiniz" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BUY">BUY</SelectItem>
                        <SelectItem value="SELL">SELL</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="volume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hacim (Lot)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="entry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giriş Fiyatı</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.00001"
                        placeholder="0.00000"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="exit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Çıkış Fiyatı</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.00001"
                        placeholder="Opsiyonel"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormDescription>Açık pozisyon için boş bırakın</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zarar Miktarı ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.00001"
                        placeholder="Opsiyonel"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kâr Miktarı ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.00001"
                        placeholder="Opsiyonel"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="swap"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Swap</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Opsiyonel (pozitif veya negatif)"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormDescription>Pozitif veya negatif swap değeri</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notlar</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="İşlem hakkında notlarınız..."
                      className="resize-none"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                İptal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {trade ? 'Güncelle' : 'Ekle'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 