'use client';

import { useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, Send, Plus, ChevronDown } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment';
  balance: number;
  lastFour: string;
}

interface TransactionFormProps {
  onSubmit: (amount: number, type: 'deposit' | 'withdraw', accountId: string) => void;
  accounts: Account[];
}

export default function TransactionModalWithAccounts({ onSubmit, accounts = [] }: TransactionFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<'deposit' | 'withdraw'>('deposit');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [showAccounts, setShowAccounts] = useState(false);

  const selectedAccount = accounts.find(acc => acc.id === selectedAccountId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount > 0 && selectedAccountId) {
      onSubmit(amount, type, selectedAccountId);
      resetForm();
    }
  };

  const resetForm = () => {
    setIsOpen(false);
    setAmount(0);
    setSelectedAccountId('');
    setShowAccounts(false);
  };

  const getAccountStyle = (type: Account['type']) => {
    switch (type) {
      case 'checking':
        return 'bg-blue-100 text-blue-600';
      case 'savings':
        return 'bg-green-100 text-green-600';
      case 'investment':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
        aria-label="Open transaction modal"
      >
        <Plus className="w-6 h-6" />
      </button>

      <Transition show={isOpen} as="div">
        <Dialog onClose={resetForm} className="relative z-50">
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <form onSubmit={handleSubmit}>
                  <Dialog.Title className="text-xl font-semibold text-gray-900 mb-4">
                    {type === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
                  </Dialog.Title>

                  {/* Type Selection */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {(['deposit', 'withdraw'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${type === t
                            ? t === 'deposit'
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                              : 'bg-rose-50 border-rose-200 text-rose-700'
                            : 'bg-gray-50 border-gray-200 text-gray-700'
                          }`}
                      >
                        {t === 'deposit' ? <ArrowDownCircle className="w-5 h-5" /> : <ArrowUpCircle className="w-5 h-5" />}
                        <span className="font-medium capitalize">{t}</span>
                      </button>
                    ))}
                  </div>

                  {/* Account Selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {type === 'deposit' ? 'To Account' : 'From Account'}
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowAccounts(!showAccounts)}
                        className="w-full p-3 border border-gray-300 rounded-lg flex justify-between items-center"
                      >
                        {selectedAccount ? (
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getAccountStyle(selectedAccount.type)}`}>
                              {selectedAccount.type.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium">{selectedAccount.name}</p>
                              <p className="text-xs text-gray-500">•••• {selectedAccount.lastFour}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500">Select an account</span>
                        )}
                        <ChevronDown className={`w-5 h-5 text-gray-400 ${showAccounts ? 'rotate-180' : ''}`} />
                      </button>

                      {showAccounts && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow max-h-60 overflow-auto">
                          {accounts.map((acc) => (
                            <button
                              key={acc.id}
                              type="button"
                              onClick={() => {
                                setSelectedAccountId(acc.id);
                                setShowAccounts(false);
                              }}
                              className="w-full flex gap-3 items-center px-3 py-2 hover:bg-gray-50 border-b last:border-none"
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getAccountStyle(acc.type)}`}>
                                {acc.type.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{acc.name}</p>
                                <p className="text-xs text-gray-500">
                                  ${acc.balance.toFixed(2)} •••• {acc.lastFour}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Amount Input */}
                  <div className="mb-4">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                      Amount in USD
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        id="amount"
                        type="number"
                        value={amount || ''}
                        onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                        min={0.01}
                        step={0.01}
                        className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 py-3 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={amount <= 0 || !selectedAccountId}
                      className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all ${amount <= 0 || !selectedAccountId
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                    >
                      <Send className="w-4 h-4" />
                      {type === 'deposit' ? 'Deposit' : 'Withdraw'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
