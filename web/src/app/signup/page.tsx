'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Fingerprint, ShieldCheck, Loader2, ArrowRight, Smartphone } from 'lucide-react';
import { startRegistration } from '@simplewebauthn/browser';
import Link from 'next/link';
import Image from 'next/image';
import BlockchainNetworkBackground from '@/components/BlockchainNetworkBackground';

export default function SignupPage() {
  const router = useRouter();
  const [householdId, setHouseholdId] = useState('');
  const [dob, setDob] = useState('');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'prompting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!householdId || !dob) return;

    setStatus('verifying');
    setErrorMessage('');

    try {
      // 1. Simulate DSWD Verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (householdId.length < 5) {
        throw new Error('Invalid DSWD Household ID. Not found in registry.');
      }

      // 2. Trigger native WebAuthn (Passkeys) for Enrollment
      setStatus('prompting');
      
      try {
        await startRegistration({
          optionsJSON: {
            challenge: 'cmFuZG9tX2NoYWxsZW5nZV9zdHJpbmdfZnJvbV9zdGVsbGFyX25ldHdvcmtfMTIz', 
            rp: { name: '4PS Nexus Smart Account', id: window.location.hostname },
            user: {
              id: btoa(householdId), 
              name: `DSWD Beneficiary ${householdId}`,
              displayName: `Beneficiary ${householdId}`
            },
            pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
            timeout: 60000,
            authenticatorSelection: { userVerification: 'required' }
          }
        });
        
        setStatus('success');
        
        localStorage.setItem('dswd_auth', householdId);
        
        setTimeout(() => {
          router.push('/beneficiary/compliance');
        }, 1500);

      } catch (authError: unknown) {
        console.error(authError);
        const err = authError as Error;
        if (err.name === 'NotAllowedError') {
          throw new Error('Biometric enrollment was cancelled or failed.');
        }
        throw new Error('Passkey creation failed: ' + err.message);
      }

    } catch (error: unknown) {
      setStatus('error');
      const err = error as Error;
      setErrorMessage(err.message || 'An unknown error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans overflow-hidden selection:bg-blue-500/30">
      
      {/* Top Bar: Logo & Back Button */}
      <div className="absolute top-8 left-8 z-50 flex items-center gap-6">
        <Image src="/logo.png" alt="4PS-Nexus Logo" width={160} height={160} className="w-auto h-12 rounded-xl shadow-sm border border-slate-200 bg-white p-1" priority />
        <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full backdrop-blur-md border border-slate-200 shadow-sm">
          &larr; Back to Home
        </Link>
      </div>

      {/* Left side - Graphic / Branding */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 border-r border-slate-200 bg-white overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 -left-1/4 w-[150%] h-[150%] bg-gradient-to-br from-blue-100/80 via-indigo-50/50 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-0 -right-1/4 w-[120%] h-[120%] bg-gradient-to-tl from-emerald-100/80 via-teal-50/50 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10 pt-16">
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Secure Device <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Enrollment</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Link your smartphone's biometrics to your DSWD profile to create your secure Stellar wallet. No passwords required.
          </p>
          
          <div className="mt-12 space-y-6">
            <div className="flex items-center gap-4 text-slate-700">
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Passkey Technology</h4>
                <p className="text-sm text-slate-500 mt-1">Your device becomes your wallet using hardware-backed biometrics.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-slate-700">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Stellar Smart Account</h4>
                <p className="text-sm text-slate-500 mt-1">A secure on-chain wallet is automatically created for you upon enrollment.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 text-slate-400 text-sm font-medium">
          © 2026 Department of Social Welfare and Development
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative bg-slate-50 overflow-hidden">
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-5 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        {/* Blockchain Network Animation */}
        <div className="absolute inset-0 z-0">
          <BlockchainNetworkBackground />
        </div>

        <div className="max-w-md w-full px-6 relative z-10">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 sm:p-10 transform transition-all hover:scale-[1.01] duration-500 relative overflow-hidden">
            
            {/* Custom Animation Styles */}
            <style>{`
              @keyframes scan {
                0% { top: 0%; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { top: 100%; opacity: 0; }
              }
              .animate-scan {
                animation: scan 2s ease-in-out infinite;
              }
              @keyframes success-pop {
                0% { transform: scale(0.8); opacity: 0; }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); opacity: 1; }
              }
              .animate-success-pop {
                animation: success-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
              }
            `}</style>

            {/* Passkey / Biometric Overlay */}
            {(status === 'prompting' || status === 'success') && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
                {status === 'prompting' ? (
                  <>
                    <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
                      <Fingerprint className="w-24 h-24 text-slate-200 absolute" strokeWidth={1} />
                      <Fingerprint className="w-24 h-24 text-blue-500 absolute animate-pulse" strokeWidth={1.5} />
                      <div className="absolute w-28 h-[2px] bg-emerald-400 shadow-[0_0_12px_3px_rgba(52,211,153,0.8)] animate-scan z-10" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Setup Passkey</h3>
                    <p className="text-slate-500 mt-2 font-medium">Place your finger on the sensor or use Face ID to create your secure wallet.</p>
                  </>
                ) : (
                  <div className="flex flex-col items-center animate-success-pop">
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-100 border-4 border-white">
                      <ShieldCheck className="w-12 h-12 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Wallet Secured!</h3>
                    <p className="text-slate-500 mt-2 font-medium">Your device is now enrolled to the Stellar network. Redirecting...</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm shadow-blue-100 border border-blue-100">
                <Fingerprint className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Enroll Device</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Enter your DSWD Household ID and Date of Birth to create your Smart Account.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSignup}>
              <div>
                <label htmlFor="householdId" className="block text-sm font-bold text-slate-700 mb-1.5">
                  DSWD Household ID
                </label>
                <input
                  id="householdId"
                  name="householdId"
                  type="text"
                  required
                  placeholder="e.g. 12345-6789"
                  value={householdId}
                  onChange={(e) => setHouseholdId(e.target.value)}
                  className="appearance-none block w-full px-4 py-3.5 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm font-medium transition-shadow"
                />
              </div>

              <div>
                <label htmlFor="dob" className="block text-sm font-bold text-slate-700 mb-1.5">
                  Date of Birth
                </label>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="appearance-none block w-full px-4 py-3.5 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm font-medium text-slate-700 transition-shadow"
                />
              </div>

              {status === 'error' && (
                <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl mt-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-rose-700 font-medium">
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status !== 'idle' && status !== 'error'}
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-blue-500/30 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all items-center gap-3 group"
                >
                  {status === 'idle' || status === 'error' ? (
                    <>
                      Create Smart Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  ) : status === 'verifying' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Verifying with DSWD...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5 text-emerald-300" /> Connecting...
                    </>
                  )}
                </button>
              </div>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium uppercase tracking-wider">
                <span className="w-8 h-px bg-slate-200"></span>
                Web3 Passkey Registration
                <span className="w-8 h-px bg-slate-200"></span>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-slate-500 font-medium">
                  Already enrolled? <Link href="/login" className="text-blue-600 font-bold hover:underline">Log in here</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
