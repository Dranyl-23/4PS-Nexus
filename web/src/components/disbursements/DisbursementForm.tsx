"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SendHorizontal } from 'lucide-react';

export function DisbursementForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Disbursement initiated successfully!');
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Disbursement</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input 
            label="Recipient Address" 
            placeholder="e.g. G..." 
            required 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Amount" 
              type="number" 
              placeholder="0.00" 
              required 
            />
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-medium text-slate-700">
                Asset
              </label>
              <select className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="USDC">USDC</option>
                <option value="XLM">XLM</option>
              </select>
            </div>
          </div>
          <Input 
            label="Memo (Optional)" 
            placeholder="Transaction reference" 
          />
          <Button type="submit" disabled={loading} className="mt-2 w-full" size="lg">
            {loading ? (
              <span className="flex items-center gap-2">
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <SendHorizontal className="w-4 h-4" />
                Send Disbursement
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
