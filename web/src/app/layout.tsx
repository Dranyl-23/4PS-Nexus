import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "4PS-Nexus | Transparent Disbursement System",
  description: "A blockchain-based disbursement system for the Philippine 4Ps program using Stellar Smart Contracts.",
};

import { WalletProvider } from "@/components/WalletProvider";
import { SmartAccountProvider } from "@/components/SmartAccountProvider";
import DashboardShell from "@/components/DashboardShell";
import OfflineBanner from "@/components/OfflineBanner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <OfflineBanner />
        <WalletProvider>
          <SmartAccountProvider>
            <DashboardShell>
              {children}
            </DashboardShell>
          </SmartAccountProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
