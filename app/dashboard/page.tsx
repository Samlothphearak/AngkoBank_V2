'use client';

import { useState, useEffect } from 'react';
import AccountBalance from '@/components/AccountBalance';  // Import AccountBalance component
import TransactionHistory from '@/components/TransactionHistory';  // Import TransactionHistory component
import TransactionForm from '@/components/TransactionForm';  // Import TransactionForm component

export default function DashboardPage() {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Array<{ id: number; type: 'deposit' | 'withdraw'; amount: number; date: string }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Fetch balance and transaction data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch balance
        const balanceRes = await fetch('/api/balance');
        if (!balanceRes.ok) throw new Error('Failed to fetch balance');
        const balanceData = await balanceRes.json();
        setBalance(balanceData.balance);

        // Fetch transactions
        const transactionsRes = await fetch('/api/transactions');
        if (!transactionsRes.ok) throw new Error('Failed to fetch transactions');
        const transactionsData = await transactionsRes.json();
        setTransactions(transactionsData.transactions);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle deposit and withdrawal actions
  const handleTransaction = async (amount: number, type: 'deposit' | 'withdraw') => {
    try {
      // Perform transaction
      const response = await fetch('/api/transaction', {
        method: 'POST',
        body: JSON.stringify({ amount, type }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to perform transaction');

      const transactionData = await response.json();

      // Update balance and transaction history
      setBalance(prevBalance => prevBalance + (type === 'deposit' ? amount : -amount));
      setTransactions(prevTransactions => [
        ...prevTransactions,
        { id: transactionData.id, type, amount, date: new Date().toLocaleDateString() },
      ]);
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing the transaction');
    }
  };

  // If loading, show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    
    <div className="dashboard-container">

      {/* Account Balance */}
      <div className="balance-section">
        <AccountBalance balance={balance} />
      </div>

      {/* Transaction Form */}
      <div className="transaction-form-section">
        <TransactionForm onSubmit={handleTransaction} />
      </div>

      {/* Transaction History */}
      <div className="transaction-history-section">
        <TransactionHistory transactions={transactions} />
      </div>
    </div>
  );
}
