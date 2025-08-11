'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Moon, Sun, LineChart, TrendingUp } from 'lucide-react';
import { useThemeStore } from '@/store/theme';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <TrendingUp className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Trading Journal
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/" ? "text-foreground" : "text-foreground/60"
              )}
            >
              İşlemler
            </Link>
            <Link
              href="/stats"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/stats" ? "text-foreground" : "text-foreground/60"
              )}
            >
              İstatistikler
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            <span className="sr-only">Tema değiştir</span>
          </Button>
        </div>
      </div>
    </header>
  );
} 