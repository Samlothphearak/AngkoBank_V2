"use client"
import { useState } from 'react';
import { Select, Button } from '@/components/ui';

export function OpenAccountForm({ userId }: { userId: string }) {
  const [accountType, setAccountType] = useState('Savings');
  const [currency, setCurrency] = useState('KHR');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/accounts/open', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          accountType,
          currency
        }),
      });
      
      if (response.ok) {
        // Refresh accounts list or show success message
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Select
        value={accountType}
        onChange={(e) => setAccountType(e.target.value)}
        options={[
          { value: 'Savings', label: 'Savings Account' },
          { value: 'Checking', label: 'Checking Account' },
          { value: 'Investment', label: 'Investment Account' },
        ]}
      />
      
      <Select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        options={[
          { value: 'KHR', label: 'Cambodian Riel' },
          { value: 'USD', label: 'US Dollar' },
        ]}
      />
      
      <Button 
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Opening...' : 'Open Account'}
      </Button>
    </div>
  );
}