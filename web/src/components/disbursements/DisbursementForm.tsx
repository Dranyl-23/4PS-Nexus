"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SendHorizontal } from 'lucide-react';

export function DisbursementForm() {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/disbursements/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountPerUser: amount,
          adminSignature: "kms-signed-demo-key" // Simulating KMS Signature
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        alert(data.message);
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Failed to connect to backend");
    } finally {
      setLoading(false);
      setAmount('');
    }
  };

  return (
    <Card className="border-indigo-100 shadow-indigo-100/50">
      <CardHeader className="bg-indigo-50/50 border-b border-indigo-50 pb-4">
        <CardTitle className="text-indigo-900">Batch Disbursement (KMS)</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm text-blue-800 mb-2">
            This action will securely disburse funds to <strong>ALL verified beneficiaries</strong> in the database using the Soroban Smart Contract.
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Input 
              label="Amount per Beneficiary (XLM)" 
              type="number" 
              placeholder="e.g. 1500" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required 
            />
          </div>
          <Button type="submit" disabled={loading} className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700" size="lg">
            {loading ? (
              <span className="flex items-center gap-2">
                Processing Batch via KMS...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <SendHorizontal className="w-4 h-4" />
                Authorize Batch Disbursement
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
