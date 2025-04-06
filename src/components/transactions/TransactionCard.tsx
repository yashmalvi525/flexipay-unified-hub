
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface Transaction {
  id: string;
  type: 'incoming' | 'outgoing';
  amount: number;
  counterparty: string;
  upiId: string;
  timestamp: Date;
  note?: string;
}

interface TransactionCardProps {
  transaction: Transaction;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const { type, amount, counterparty, upiId, timestamp, note } = transaction;
  
  const isIncoming = type === 'incoming';
  const Icon = isIncoming ? ArrowDownLeft : ArrowUpRight;
  const amountColor = isIncoming ? 'text-green-500' : 'text-red-500';
  const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });

  return (
    <Card className="card-hover">
      <CardContent className="p-4 flex items-center space-x-4">
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isIncoming ? 'bg-green-100' : 'bg-red-100'}`}>
          <Icon className={`h-5 w-5 ${isIncoming ? 'text-green-500' : 'text-red-500'}`} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{counterparty}</h3>
            <p className={`font-medium ${amountColor}`}>
              {isIncoming ? '+ ' : '- '}₹{amount.toLocaleString()}
            </p>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>Via {upiId}</p>
            <p>{timeAgo}</p>
          </div>
          
          {note && <p className="text-xs text-muted-foreground mt-1">{note}</p>}
        </div>
      </CardContent>
    </Card>
  );
};
