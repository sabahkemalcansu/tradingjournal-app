import { z } from 'zod';

export const tradeFormSchema = z.object({
  symbol: z.string().min(1, 'Sembol gerekli').toUpperCase(),
  datetime: z.string().min(1, 'Tarih ve saat gerekli'),
  type: z.enum(['BUY', 'SELL']),
  volume: z.number().positive('Hacim pozitif olmalı'),
  entry: z.number().positive('Giriş fiyatı pozitif olmalı'),
  exit: z.number().positive('Çıkış fiyatı pozitif olmalı').optional().nullable(),
  sl: z.number().positive('S/L pozitif olmalı').optional().nullable(),
  tp: z.number().positive('T/P pozitif olmalı').optional().nullable(),
  swap: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type TradeFormData = z.infer<typeof tradeFormSchema>;

// CSV import için validation
export const csvTradeSchema = z.object({
  symbol: z.string().min(1),
  datetime: z.string().min(1),
  type: z.enum(['BUY', 'SELL']),
  volume: z.number().positive(),
  entry: z.number().positive(),
  exit: z.number().positive().optional().nullable(),
  sl: z.number().positive().optional().nullable(),
  tp: z.number().positive().optional().nullable(),
  swap: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type CSVTradeData = z.infer<typeof csvTradeSchema>; 