
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface Transaction {
  id: string;
  type: 'incoming' | 'outgoing';
  amount: number;
  
  // Sender details
  senderName: string;
  senderUpiId: string;
  
  // Receiver details
  receiverName: string;
  receiverUpiId: string;
  
  timestamp: Date;
  note?: string;
  
  // For backward compatibility
  counterparty: string;
  upiId: string;
}

interface TransactionCardProps {
  transaction: Transaction;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const { 
    type, 
    amount, 
    senderName, 
    senderUpiId, 
    receiverName, 
    receiverUpiId,
    timestamp, 
    note,
    // Fallbacks for backward compatibility
    counterparty = '',
    upiId = ''
  } = transaction;
  
  const isIncoming = type === 'incoming';
  const Icon = isIncoming ? ArrowDownLeft : ArrowUpRight;
  const amountColor = isIncoming ? 'text-green-500' : 'text-red-500';
  const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });
  
  // Use either new fields or fallback to old fields for backward compatibility
  const displaySenderName = senderName || (isIncoming ? counterparty : 'You');
  const displaySenderUpiId = senderUpiId || (isIncoming ? '' : upiId);
  const displayReceiverName = receiverName || (isIncoming ? 'You' : counterparty);
  const displayReceiverUpiId = receiverUpiId || (isIncoming ? upiId : '');

  return (
    <Card className="card-hover bg-gradient-to-r from-white to-gray-50 border-gray-200/80 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center space-x-3">
          <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${
            isIncoming 
              ? 'bg-green-100 dark:bg-green-900/30' 
              : 'bg-red-100 dark:bg-red-900/30'
          }`}>
            <Icon className={`h-5 w-5 ${
              isIncoming 
                ? 'text-green-500 dark:text-green-400' 
                : 'text-red-500 dark:text-red-400'
            }`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold truncate dark:text-white">
                {isIncoming ? 'Received' : 'Sent'} Payment
              </h3>
              <p className={`font-medium whitespace-nowrap ${amountColor}`}>
                {isIncoming ? '+ ' : '- '}₹{amount.toLocaleString()}
              </p>
            </div>
            
            <div className="mt-1 text-xs sm:text-sm">
              <div className="flex items-center text-muted-foreground">
                <span className="font-medium text-foreground truncate max-w-[80px] dark:text-gray-200">{displaySenderName}</span>
                {displaySenderUpiId && (
                  <span className="ml-1 hidden sm:inline truncate dark:text-gray-400">({displaySenderUpiId})</span>
                )}
                <ArrowRight className="h-3.5 w-3.5 mx-1 shrink-0 dark:text-gray-400" />
                <span className="font-medium text-foreground truncate max-w-[80px] dark:text-gray-200">{displayReceiverName}</span>
                {displayReceiverUpiId && (
                  <span className="ml-1 hidden sm:inline truncate dark:text-gray-400">({displayReceiverUpiId})</span>
                )}
              </div>
            </div>

            <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
              <p className="dark:text-gray-400">{timeAgo}</p>
              
              {note && <p className="italic bg-muted px-2 py-0.5 rounded-full text-xs truncate max-w-[120px] sm:max-w-none dark:bg-gray-800 dark:text-gray-300">{note}</p>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
