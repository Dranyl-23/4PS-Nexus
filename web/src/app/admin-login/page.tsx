'use client';
import { useWalletContext } from '@/components/WalletProvider';
import { Shield, Loader2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLogin() {
  const { connect, connecting, error, publicKey } = useWalletContext();
  const router = useRouter();

  useEffect(() => {
    // If successfully connected and we have a pubkey, they are an admin
    if (publicKey) {
      router.push('/admin');
    }
  }, [publicKey, router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 relative overflow-hidden">
        
        {/* Background gradient decoration */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600 to-indigo-700 opacity-10"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-200">
            <Shield className="w-8 h-8" />
          </div>
          
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Admin Portal</h1>
          <p className="text-slate-500 mb-8 max-w-sm">
            Restricted access. Please connect your authorized administrative wallet to proceed.
          </p>

          {error && (
            <div className="w-full bg-red-50 text-red-600 border border-red-200 rounded-xl p-4 mb-6 text-sm font-medium text-left">
              {error}
            </div>
          )}

          <button
            onClick={connect}
            disabled={connecting}
            className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {connecting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                Connect Freighter Wallet
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          
          <p className="mt-6 text-xs text-slate-400 font-medium uppercase tracking-wider">
            Powered by Stellar
          </p>
        </div>
      </div>
    </div>
  );
}
