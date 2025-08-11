# Trading Journal - Forex İşlem Takip Uygulaması

Modern, offline-first forex trading journal uygulaması. Tüm verileriniz tarayıcınızda güvenle saklanır.

## 🚀 Özellikler

- ✅ **Manuel İşlem Girişi**: Forex işlemlerinizi detaylı olarak kaydedin
- ✅ **Aylık Takip**: Excel benzeri ay sekmeleri ile organize takip
- ✅ **P&L Hesaplamaları**: BUY/SELL yön duyarlı otomatik kar/zarar hesaplaması
- ✅ **İstatistikler**: Detaylı performans analizleri ve grafikler
- ✅ **Offline-First**: Tüm veriler IndexedDB'de lokal olarak saklanır
- ✅ **Dark/Light Tema**: Göz yormayan tema desteği
- ✅ **Responsive Tasarım**: Mobil uyumlu arayüz

## 🛠️ Teknoloji Stack

- **Framework**: Next.js 15 (App Router)
- **Dil**: TypeScript
- **Stil**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Veritabanı**: Dexie (IndexedDB wrapper)
- **Validasyon**: Zod
- **Grafikler**: Recharts
- **Form**: React Hook Form
- **Tarih**: date-fns
- **Sayı Formatlama**: numeral

## 📦 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build

# Production sunucusu
npm start
```

## 🏗️ Proje Yapısı

```
tradingjournal-app/
├── app/
│   ├── layout.tsx          # Ana layout
│   ├── page.tsx            # Ana sayfa (İşlemler)
│   └── stats/
│       └── page.tsx        # İstatistikler sayfası
├── components/
│   ├── month-tabs.tsx      # Aylık sekmeler
│   ├── trade-table.tsx     # İşlem tablosu
│   ├── trade-form-dialog.tsx # İşlem form dialog
│   ├── trade-stats.tsx     # Özet istatistikler
│   ├── kpi-cards.tsx       # KPI kartları
│   ├── charts/
│   │   ├── symbol-bar.tsx  # Sembol bar chart
│   │   ├── monthly-pl-line.tsx # P&L trend chart
│   │   └── buy-sell-pie.tsx    # İşlem tipi dağılımı
│   └── ui/                 # shadcn/ui komponentleri
├── lib/
│   ├── db.ts               # Dexie veritabanı kurulumu
│   ├── repo.ts             # Repository katmanı
│   ├── calc.ts             # Hesaplama fonksiyonları
│   ├── format.ts           # Formatlama yardımcıları
│   ├── types.ts            # TypeScript tipleri
│   └── validations.ts      # Zod şemaları
└── store/
    ├── trades.ts           # İşlem state yönetimi
    └── theme.ts            # Tema state yönetimi
```

## 📊 Veri Modeli

```typescript
interface Trade {
  id: string;                // UUID
  symbol: string;            // Sembol (XAUUSD, EURUSD vb.)
  datetime: string;          // İşlem tarihi ve saati (ISO)
  type: 'BUY' | 'SELL';      // İşlem tipi
  volume: number;            // Lot miktarı
  entry: number;             // Giriş fiyatı
  exit?: number | null;      // Çıkış fiyatı (opsiyonel)
  sl?: number | null;        // Stop Loss
  tp?: number | null;        // Take Profit
  swap?: number | null;      // Swap ücreti
  notes?: string | null;     // Notlar
  
  // Hesaplanan alanlar
  monthKey: string;          // YYYY-MM formatında ay
  changePct: number;         // Değişim yüzdesi
  plPct: number;             // P&L yüzdesi
  plSign: '+' | '-';         // Kar/Zarar işareti
}
```

## 📈 P&L Hesaplama Mantığı

- **BUY İşlemleri**: `((exit - entry) / entry) * 100`
- **SELL İşlemleri**: `((entry - exit) / entry) * 100`
- **Aylık P&L**: Hacim ağırlıklı ortalama
- **Win Rate**: Sadece kapalı pozisyonlar üzerinden hesaplanır

## 🎯 Kullanım

### İşlem Ekleme
1. "Yeni İşlem" butonuna tıklayın
2. Sembol, tarih, tip ve fiyat bilgilerini girin
3. Opsiyonel olarak SL/TP ve notlar ekleyin
4. Kaydet'e tıklayın

### Aylık Takip
- Üst sekmelerde aylar arasında geçiş yapın
- "Bu Ay" sekmesi her zaman güncel ayı gösterir
- Her ay için ayrı istatistikler görüntülenir

### İstatistikler
- En çok işlem yapılan sembol
- Toplam işlem sayısı
- Aylık P&L yüzdesi
- Win rate (kazanç oranı)
- Sembol bazında detaylı performans

## 🔄 Import/Export

CSV ve JSON formatında veri import/export özelliği yakında eklenecek.

## 🌙 Tema Değiştirme

Sağ üstteki ay/güneş ikonuna tıklayarak dark/light tema arasında geçiş yapabilirsiniz.

## ⌨️ Klavye Kısayolları

- `N`: Yeni işlem dialog'unu aç
- `F`: Filtre panelini aç/kapat (yakında)

## 🔒 Veri Güvenliği

Tüm verileriniz yerel tarayıcınızda IndexedDB'de saklanır. Veriler hiçbir sunucuya gönderilmez.

## 📝 Lisans

MIT

## 🤝 Katkıda Bulunma

Pull request'ler kabul edilir. Büyük değişiklikler için önce bir issue açınız.

## 🐛 Bilinen Sorunlar

- Import/Export özellikleri henüz tamamlanmadı
- Filtreler henüz tam işlevsel değil

## 📧 İletişim

Sorularınız için issue açabilirsiniz.
