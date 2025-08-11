'use client';

import { useEffect, useState } from 'react';
import { useTradeStore } from '@/store/trades';
import { Trade } from '@/lib/types';
import { TradeFormData } from '@/lib/validations';
import { MonthTabs } from '@/components/month-tabs';
import { TradeTable } from '@/components/trade-table';
import { TradeStats } from '@/components/trade-stats';
import { TradeFormDialog } from '@/components/trade-form-dialog';
import { Button } from '@/components/ui/button';
import { Plus, FileDown, FileUp, Database, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { seedDemoData } from '@/lib/seed-data';
import { tradeRepo } from '@/lib/repo';

export default function HomePage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Trade | null>(null);
  const [seedingData, setSeedingData] = useState(false);
  const [clearingData, setClearingData] = useState(false);
  
  const { toast } = useToast();
  
  const {
    trades,
    loading,
    activeMonthKey,
    loadTradesByMonth,
    addTrade,
    updateTrade,
    deleteTrade,
    refreshMetadata,
  } = useTradeStore();

  // İlk yüklemede metadata ve trade'leri yükle
  useEffect(() => {
    refreshMetadata();
    loadTradesByMonth(activeMonthKey);
  }, []);

  // Aktif ay değiştiğinde trade'leri yeniden yükle
  useEffect(() => {
    loadTradesByMonth(activeMonthKey);
  }, [activeMonthKey]);

  const handleAddTrade = async (data: TradeFormData) => {
    const result = await addTrade(data);
    if (result) {
      setFormOpen(false);
    }
  };

  const handleUpdateTrade = async (data: TradeFormData) => {
    if (!editingTrade) return;
    
    const result = await updateTrade(editingTrade.id, data);
    if (result) {
      setEditingTrade(null);
    }
  };

  const handleEdit = (trade: Trade) => {
    setEditingTrade(trade);
  };

  const handleDelete = async (trade: Trade) => {
    const confirmed = window.confirm(
      `${trade.symbol} işlemini silmek istediğinizden emin misiniz?`
    );
    
    if (confirmed) {
      const success = await deleteTrade(trade.id);
      if (success) {
        toast({
          title: 'Başarılı',
          description: 'İşlem silindi',
        });
      } else {
        toast({
          title: 'Hata',
          description: 'İşlem silinemedi',
          variant: 'destructive',
        });
      }
    }
  };

  const handleSeedData = async () => {
    setSeedingData(true);
    try {
      const count = await seedDemoData();
      await refreshMetadata();
      await loadTradesByMonth(activeMonthKey);
      toast({
        title: 'Başarılı',
        description: `${count} demo işlem eklendi`,
      });
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Demo veriler eklenemedi',
        variant: 'destructive',
      });
    } finally {
      setSeedingData(false);
    }
  };

  const handleClearData = async () => {
    const confirmed = window.confirm(
      'Tüm verileri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!'
    );
    
    if (confirmed) {
      setClearingData(true);
      try {
        await tradeRepo.clear();
        await refreshMetadata();
        await loadTradesByMonth(activeMonthKey);
        toast({
          title: 'Başarılı',
          description: 'Tüm veriler silindi',
        });
      } catch (error) {
        toast({
          title: 'Hata',
          description: 'Veriler silinemedi',
          variant: 'destructive',
        });
      } finally {
        setClearingData(false);
      }
    }
  };

  return (
    <div className="container py-6 space-y-6">
      {/* Başlık ve aksiyonlar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">İşlemler</h1>
          <p className="text-muted-foreground">
            Forex işlemlerinizi takip edin ve analiz edin
          </p>
        </div>
        <div className="flex items-center gap-2">
          {trades.length === 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSeedData}
              disabled={seedingData}
            >
              <Database className="mr-2 h-4 w-4" />
              {seedingData ? 'Ekleniyor...' : 'Demo Veri Ekle'}
            </Button>
          )}
          {trades.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearData}
              disabled={clearingData}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {clearingData ? 'Siliniyor...' : 'Tüm Verileri Sil'}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // TODO: Import functionality
              toast({
                title: 'Yakında',
                description: 'İçe aktarma özelliği yakında eklenecek',
              });
            }}
          >
            <FileUp className="mr-2 h-4 w-4" />
            İçe Aktar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // TODO: Export functionality
              toast({
                title: 'Yakında',
                description: 'Dışa aktarma özelliği yakında eklenecek',
              });
            }}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Dışa Aktar
          </Button>
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni İşlem
          </Button>
        </div>
      </div>

      {/* Aylık sekmeler */}
      <MonthTabs />

      {/* İstatistik kartları */}
      <TradeStats trades={trades} />

      {/* İşlem tablosu */}
      <TradeTable 
        trades={trades} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Yeni işlem dialog */}
      <TradeFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleAddTrade}
      />

      {/* Düzenleme dialog */}
      <TradeFormDialog
        open={!!editingTrade}
        onOpenChange={(open) => !open && setEditingTrade(null)}
        trade={editingTrade}
        onSubmit={handleUpdateTrade}
      />
    </div>
  );
}
