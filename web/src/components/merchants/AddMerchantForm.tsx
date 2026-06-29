'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function AddMerchantForm() {
  return (
    <Card className="flex flex-col shadow-sm">
      <CardHeader className="shrink-0 pb-4">
        <CardTitle>Onboard Merchant</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Merchant Name</label>
            <Input placeholder="e.g. Mercury Drug - Manila" className="w-full" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Category</label>
            <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-sm text-slate-900">
              <option value="" disabled defaultValue="">Select category...</option>
              <option value="pharmacy">Pharmacy & Healthcare</option>
              <option value="grocery">Grocery & Supermarket</option>
              <option value="school">School & Education</option>
              <option value="hardware">Hardware & Housing</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Stellar Wallet Address</label>
            <Input placeholder="G..." className="w-full font-mono text-sm" />
            <p className="text-xs text-slate-500 mt-1">This address will be whitelisted in the Soroban smart contract.</p>
          </div>

          <div className="pt-4">
            <Button className="w-full" type="submit">
              Submit for Approval
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
