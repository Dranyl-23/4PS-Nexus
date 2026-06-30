'use client';
import { MerchantWalletProvider } from '@/components/MerchantWalletProvider';

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  return (
    <MerchantWalletProvider>
      {children}
    </MerchantWalletProvider>
  );
}
