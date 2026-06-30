'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Fingerprint, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import { startRegistration } from '@simplewebauthn/browser';

export default function LoginPage() {
  const router = useRouter();
  const [householdId, setHouseholdId] = useState('');
  const [dob, setDob] = useState('');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'prompting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
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

      // 2. Trigger native WebAuthn (Passkeys)
      setStatus('prompting');
      
      // In a real full implementation, we'd fetch challenge from backend.
      // Here we simulate the WebAuthn API call which triggers the native hardware scanner.
      try {
        // We use a dummy challenge to wake up the OS biometric scanner
        // In reality, this would be signed by the Smart Account WebAuthn Verifier
        await startRegistration({
          optionsJSON: {
            challenge: 'cmFuZG9tX2NoYWxsZW5nZV9zdHJpbmdfZnJvbV9zdGVsbGFyX25ldHdvcmtfMTIz', // must be base64url
            rp: { name: '4PS Nexus Smart Account', id: window.location.hostname },
            user: {
              id: btoa(householdId), // base64 encoded
              name: `DSWD Beneficiary ${householdId}`,
              displayName: `Beneficiary ${householdId}`
            },
            pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
            timeout: 60000,
            authenticatorSelection: { userVerification: 'required' }
          }
        });
        
        setStatus('success');
        
        // Save auth state
        localStorage.setItem('dswd_auth', householdId);
        
        // Redirect to dashboard
        setTimeout(() => {
          router.push('/beneficiary/compliance');
        }, 1500);

      } catch (authError: unknown) {
        console.error(authError);
        const err = authError as Error;
        if (err.name === 'NotAllowedError') {
          throw new Error('Biometric authentication was cancelled or failed.');
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">4PS Nexus</h2>
        <p className="mt-2 text-sm text-slate-500">
          Secure Web3 Login via DSWD Registry
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100 relative overflow-hidden">
          
          {/* Decorative background element */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
          
          <form className="space-y-6 relative z-10" onSubmit={handleLogin}>
            <div>
              <label htmlFor="householdId" className="block text-sm font-bold text-slate-700">
                DSWD Household ID
              </label>
              <div className="mt-1 relative">
                <input
                  id="householdId"
                  name="householdId"
                  type="text"
                  required
                  placeholder="e.g. 12345-6789"
                  value={householdId}
                  onChange={(e) => setHouseholdId(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm font-medium transition-shadow"
                />
              </div>
            </div>

            <div>
              <label htmlFor="dob" className="block text-sm font-bold text-slate-700">
                Date of Birth
              </label>
              <div className="mt-1">
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm font-medium text-slate-700 transition-shadow"
                />
              </div>
            </div>

            {status === 'error' && (
              <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-rose-700 font-medium">
                      {errorMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={status !== 'idle' && status !== 'error'}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all items-center gap-2"
              >
                {status === 'idle' || status === 'error' ? (
                  <>Continue <ArrowRight className="w-4 h-4" /></>
                ) : status === 'verifying' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Verifying with DSWD...</>
                ) : status === 'prompting' ? (
                  <><Fingerprint className="w-5 h-5 animate-pulse" /> Scan Biometrics...</>
                ) : (
                  <><ShieldCheck className="w-5 h-5" /> Authorized!</>
                )}
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                By logging in, a Stellar Smart Account will be cryptographically linked to your device passkey.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
