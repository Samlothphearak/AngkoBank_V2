'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, AlertCircle } from 'lucide-react';

type Account = {
  id: number;
  balance: number;
  accountNumber: string;
  accountType: string;
  currency: string;
  status: 'active' | 'frozen' | 'closed';
};

export default function AccountBalance() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          throw new Error('Authentication required');
        }

        const res = await fetch('/api/accounts', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch accounts');
        }

        if (!data.accounts || data.accounts.length === 0) {
          throw new Error('No accounts found');
        }

        setAccounts(data.accounts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load accounts');
        console.error('Error fetching accounts:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAccounts();
  }, []);

  // Format account number in Cambodian bank format (XXXX-XXX-XXXXX)
  const formatAccountNumber = (accountNumber: string) => {
    if (!accountNumber) return 'N/A';
    const cleanNumber = accountNumber.replace(/\D/g, '');
    if (cleanNumber.length === 12) {
      return cleanNumber.replace(/(\d{4})(\d{3})(\d{5})/, '$1-$2-$3');
    }
    return accountNumber; // Return original if not 12 digits
  };

  // Format currency in Cambodian style
  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'KHR') {
      // Cambodian Riel: no decimals, comma separators, ៛ symbol
      return new Intl.NumberFormat('km-KH', {
        style: 'currency',
        currency: 'KHR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } else {
      // USD: 2 decimals, $ symbol
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[180px] w-full rounded-xl bg-gray-200" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24 rounded-lg bg-gray-200" />
          <Skeleton className="h-10 w-24 rounded-lg bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error || accounts.length === 0) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h3 className="font-medium text-red-800">
              {error || 'No accounts found'}
            </h3>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-700">
            {error 
              ? 'Failed to load account information'
              : 'You currently have no active accounts'}
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentAccount = accounts[activeTab];

  return (
    <div className="space-y-4">
      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">
              Available Balance
            </h3>
            <Badge 
              variant={currentAccount.status === 'active' ? 'default' : 'destructive'}
              className={currentAccount.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
            >
              {currentAccount.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(currentAccount.balance, currentAccount.currency)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {currentAccount.accountType} Account
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="flex justify-between w-full text-sm">
            <div>
              <p className="text-gray-500">Account Number</p>
              <p className="font-mono font-medium tracking-tight">
                {formatAccountNumber(currentAccount.accountNumber)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Currency</p>
              <p className="font-medium">
                {currentAccount.currency === 'KHR' ? 'រៀល (KHR)' : 'ដុល្លារ (USD)'}
              </p>
            </div>
          </div>
        </CardFooter>
      </Card>

      {accounts.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {accounts.map((account, index) => (
            <button
              key={account.id}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === index
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {account.currency === 'KHR' ? 'KHR' : 'USD'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}