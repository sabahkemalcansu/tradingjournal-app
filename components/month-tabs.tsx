'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatMonthShort } from '@/lib/format';
import { useTradeStore } from '@/store/trades';
import { format } from 'date-fns';

export function MonthTabs() {
  const { monthKeys, activeMonthKey, setActiveMonth } = useTradeStore();
  const currentMonth = format(new Date(), 'yyyy-MM');

  // Ensure current month is always shown
  const displayMonths = monthKeys.includes(currentMonth) 
    ? monthKeys 
    : [currentMonth, ...monthKeys];

  return (
    <Tabs value={activeMonthKey} onValueChange={setActiveMonth}>
      <TabsList className="w-full justify-start overflow-x-auto h-auto flex-wrap">
        {displayMonths.map((monthKey) => (
          <TabsTrigger
            key={monthKey}
            value={monthKey}
            className="min-w-[100px]"
          >
            {monthKey === currentMonth ? (
              <span className="font-semibold">Bu Ay</span>
            ) : (
              formatMonthShort(monthKey)
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
} 