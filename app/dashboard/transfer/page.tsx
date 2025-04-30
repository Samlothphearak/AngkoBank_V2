'use client';

import { useState } from 'react';
import { ArrowRight, Lock, ShieldCheck, Clock, Banknote, User, BadgeDollarSign } from 'lucide-react';

export default function TransferPage() {
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    memo: '',
    account: 'primary',
    securityCode: ''
  });
  const [step, setStep] = useState<1 | 2>(1); // 1: Details, 2: Confirmation
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{text: string; type: 'success' | 'error'} | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const res = await fetch('/api/transfer', {
        method: 'POST',
        body: JSON.stringify({ 
          recipient: formData.recipient,
          amount: parseFloat(formData.amount),
          memo: formData.memo,
          account: formData.account
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        setMessage({ text: 'Transfer completed successfully!', type: 'success' });
        setFormData({
          recipient: '',
          amount: '',
          memo: '',
          account: 'primary',
          securityCode: ''
        });
        setStep(1);
      } else {
        const error = await res.json();
        setMessage({ text: error.message || 'Transfer failed', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Network error. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    return formData.recipient && formData.amount && parseFloat(formData.amount) > 0;
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      {/* Transfer Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-full">
          <ArrowRight className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Wire Transfer</h1>
          <p className="text-sm text-gray-500">Send money securely</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex mb-8">
        <div className={`flex-1 border-t-4 ${step >= 1 ? 'border-blue-600' : 'border-gray-200'} pt-2`}>
          <p className={`text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>Transfer Details</p>
        </div>
        <div className={`flex-1 border-t-4 ${step === 2 ? 'border-blue-600' : 'border-gray-200'} pt-2`}>
          <p className={`text-sm font-medium ${step === 2 ? 'text-blue-600' : 'text-gray-500'}`}>Confirmation</p>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-start ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.type === 'success' ? (
            <ShieldCheck className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
          ) : (
            <Lock className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
          )}
          <div>
            <p className="font-medium">{message.text}</p>
            {message.type === 'success' && (
              <p className="text-sm mt-1">Reference #: {Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
            )}
          </div>
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="account" className="block text-sm font-medium text-gray-700 mb-2">
                From Account
              </label>
              <select
                id="account"
                name="account"
                value={formData.account}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                required
              >
                <option value="primary">Primary Checking (•••• 4892)</option>
                <option value="savings">Savings Account (•••• 7821)</option>
                <option value="business">Business Account (•••• 5623)</option>
              </select>
            </div>

            <div>
              <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="recipient"
                  name="recipient"
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="recipient@example.com"
                  value={formData.recipient}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BadgeDollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="amount"
                name="amount"
                type="number"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500">USD</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Available balance: $12,450.00</p>
          </div>

          <div className="mb-8">
            <label htmlFor="memo" className="block text-sm font-medium text-gray-700 mb-2">
              Memo (Optional)
            </label>
            <textarea
              id="memo"
              name="memo"
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Description of this transfer"
              value={formData.memo}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!validateForm()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Review Your Transfer</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">From Account:</span>
                <span className="font-medium">
                  {formData.account === 'primary' ? 'Primary Checking' : 
                   formData.account === 'savings' ? 'Savings Account' : 'Business Account'} (•••• {formData.account === 'primary' ? '4892' : formData.account === 'savings' ? '7821' : '5623'})
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">To Recipient:</span>
                <span className="font-medium">{formData.recipient}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium text-blue-600">${parseFloat(formData.amount).toFixed(2)} USD</span>
              </div>
              
              {formData.memo && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Memo:</span>
                  <span className="font-medium">{formData.memo}</span>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transfer Fee:</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-600">Estimated Delivery:</span>
                  <span className="font-medium flex items-center">
                    <Clock className="w-4 h-4 mr-1" /> Within 1 business day
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="securityCode" className="block text-sm font-medium text-gray-700 mb-2">
              Security Verification
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="securityCode"
                name="securityCode"
                type="password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your security code"
                value={formData.securityCode}
                onChange={handleChange}
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">For your security, please confirm this transaction</p>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.securityCode}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <Banknote className="w-5 h-5 mr-2" />
                  Confirm Transfer
                </>
              )}
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div className="flex items-start">
          <ShieldCheck className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-blue-800 mb-1">Secure Transfer Guarantee</h3>
            <p className="text-xs text-blue-600">
              All transfers are encrypted and protected by our bank-level security. 
              Your money is safe with us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}