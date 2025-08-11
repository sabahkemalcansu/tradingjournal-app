import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/toaster";
import { AuthGuard } from "@/components/auth-guard";
import { usePathname } from 'next/navigation';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trading Journal - Forex İşlem Takibi",
  description: "Forex işlemlerinizi takip edin, analiz edin ve performansınızı iyileştirin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Basit şekilde auth routes dışını korumak için client wrapper kullanacağız
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <AuthGuard>
              <main className="flex-1">{children}</main>
            </AuthGuard>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
