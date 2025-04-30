import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { FiArrowUp, FiArrowDown, FiDollarSign, FiCalendar, FiFilter } from 'react-icons/fi';

export default async function TransactionsPage() {
  const session = await getServerSession();
  if (!session) {
    redirect('/login');
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50 // Limit to 50 most recent transactions
  });

  // Calculate balance
  const balance = transactions.reduce((acc, transaction) => {
    return transaction.type === 'DEPOSIT' 
      ? acc + transaction.amount 
      : acc - transaction.amount;
  }, 0);

  // Group transactions by date
  const transactionsByDate = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.createdAt).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {} as Record<string, typeof transactions>);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-500">View all your account activity</p>
        </div>

        {/* Balance Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Current Balance</h2>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {balance.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD'
                })}
              </p>
            </div>
            <div className="bg-indigo-50 p-3 rounded-full">
              <FiDollarSign className="text-indigo-600 text-xl" />
            </div>
          </div>
        </div>

        {/* Filters (placeholder for client-side functionality) */}
        <div className="mb-6 flex items-center space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="text-gray-400" />
            </div>
            <select 
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none"
            >
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>This year</option>
              <option>All time</option>
            </select>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50">
            <FiFilter className="text-gray-500" />
            <span>Filter</span>
          </button>
        </div>

        {/* Transactions List */}
        <div className="space-y-6">
          {Object.entries(transactionsByDate).map(([date, dailyTransactions]) => (
            <div key={date} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              {/* Date Header */}
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-100">
                <h3 className="font-medium text-gray-700">{date}</h3>
              </div>
              
              {/* Transactions */}
              <ul className="divide-y divide-gray-100">
                {dailyTransactions.map((transaction) => (
                  <li key={transaction.id} className="px-6 py-4 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${transaction.type === 'DEPOSIT' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          {transaction.type === 'DEPOSIT' ? <FiArrowDown /> : <FiArrowUp />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {transaction.type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.description || 'No description'}
                          </p>
                        </div>
                      </div>
                      <div className={`text-right ${transaction.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'}`}>
                        <p className="font-medium">
                          {transaction.type === 'DEPOSIT' ? '+' : '-'}
                          {transaction.amount.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD'
                          })}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(transaction.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {transactions.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiDollarSign className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No transactions yet</h3>
            <p className="text-gray-500">Your transactions will appear here once you make a deposit or withdrawal.</p>
          </div>
        )}
      </div>
    </div>
  );
}