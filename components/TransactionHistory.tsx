// components/CompactTransactionHistory.tsx
interface Transaction {
  id: number;
  type: 'deposit' | 'withdrawal';
  amount: number;
  date: string;
}

interface CompactTransactionHistoryProps {
  transactions?: Transaction[]; // Make it optional
  maxItems?: number;
}

export default function CompactTransactionHistory({ 
  transactions = [], // Provide default empty array
  maxItems = 5 
}: CompactTransactionHistoryProps) {
  const displayedTransactions = transactions.slice(0, maxItems);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 w-full max-w-xs">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Transactions</h3>
      
      {displayedTransactions.length === 0 ? (
        <p className="text-xs text-gray-500 text-center py-2">No transactions yet</p>
      ) : (
        <ul className="space-y-2">
          {displayedTransactions.map((transaction) => (
            <li key={transaction.id} className="flex justify-between items-start">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  transaction.type === 'deposit' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-xs text-gray-600">
                  {new Date(transaction.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <span className={`text-xs font-medium ${
                transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {transactions.length > maxItems && (
        <p className="text-xs text-gray-500 mt-2 text-right">
          +{transactions.length - maxItems} more
        </p>
      )}
    </div>
  );
}