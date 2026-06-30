'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export function AddMerchantForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [wallet, setWallet] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category || !location || !wallet) {
      alert("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/merchants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, location, wallet })
      });

      if (res.ok) {
        setName('');
        setCategory('');
        setLocation('');
        setWallet('');
        window.location.reload(); // Quick refresh to update tables
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to add merchant');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="flex flex-col shadow-sm">
      <CardHeader className="shrink-0 pb-4">
        <CardTitle>Onboard Merchant</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Merchant Name</label>
            <Input 
              placeholder="e.g. Mercury Drug - Manila" 
              className="w-full" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Category</label>
            <select 
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm text-slate-900"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="" disabled>Select category...</option>
              <option value="pharmacy">Pharmacy & Healthcare</option>
              <option value="grocery">Grocery & Supermarket</option>
              <option value="school">School & Education</option>
              <option value="hardware">Hardware & Housing</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Physical Address</label>
            <Input 
              placeholder="e.g. J.P. Laurel Ave, Davao City" 
              className="w-full" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isSubmitting}
            />
            <p className="text-xs text-slate-500 mt-1">This will be used to pinpoint the store on the map.</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Stellar Wallet Address</label>
            <Input 
              placeholder="G..." 
              className="w-full font-mono text-sm" 
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              disabled={isSubmitting}
            />
            <p className="text-xs text-slate-500 mt-1">This address will be whitelisted in the Soroban smart contract.</p>
          </div>

          <div className="pt-4">
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
