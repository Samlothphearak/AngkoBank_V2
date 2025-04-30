// components/TransactionItem.tsx
interface TransactionItemProps {
    type: 'deposit' | 'withdrawal';
    amount: number;
    date: string;
  }
  
  export default function TransactionItem({ type, amount, date }: TransactionItemProps) {
    return (
      <div className="flex justify-between items-center py-3 border-b border-gray-200">
        <span className="text-gray-600">{date}</span>
        <span className={`font-semibold ${type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>
          {type === 'deposit' ? '+' : '-'}${amount.toFixed(2)}
        </span>
      </div>
    );
  }
  