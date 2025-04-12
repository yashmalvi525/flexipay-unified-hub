
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  ArrowRight,
  Smartphone
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';

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
  provider?: 'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'other';
  
  // For backward compatibility
  counterparty: string;
  upiId: string;
}

interface TransactionCardProps {
  transaction: Transaction;
  showFullDetails?: boolean;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ 
  transaction,
  showFullDetails = false
}) => {
  const { 
    type, 
    amount, 
    senderName, 
    senderUpiId, 
    receiverName, 
    receiverUpiId,
    timestamp, 
    note,
    provider = 'other',
    // Fallbacks for backward compatibility
    counterparty = '',
    upiId = ''
  } = transaction;
  
  const isMobile = useIsMobile();
  const isIncoming = type === 'incoming';
  const Icon = isIncoming ? ArrowDownLeft : ArrowUpRight;
  const amountColor = isIncoming ? 'text-green-500' : 'text-red-500';
  const amountColorDark = isIncoming ? 'dark:text-green-400' : 'dark:text-red-400';
  const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });
  
  // Use either new fields or fallback to old fields for backward compatibility
  const displaySenderName = senderName || (isIncoming ? counterparty : 'You');
  const displaySenderUpiId = senderUpiId || (isIncoming ? '' : upiId);
  const displayReceiverName = receiverName || (isIncoming ? 'You' : counterparty);
  const displayReceiverUpiId = receiverUpiId || (isIncoming ? upiId : '');

  // Get provider logo based on UPI ID or specified provider
  const getProviderLogo = () => {
    const upiToCheck = isIncoming ? displaySenderUpiId : displayReceiverUpiId;
    
    if (provider !== 'other') {
      return provider;
    }
    
    if (upiToCheck.includes('gpay') || upiToCheck.includes('google')) {
      return 'gpay';
    } else if (upiToCheck.includes('phonepe') || upiToCheck.includes('ybl')) {
      return 'phonepe';
    } else if (upiToCheck.includes('paytm')) {
      return 'paytm';
    } else if (upiToCheck.includes('bhim') || upiToCheck.includes('upi')) {
      return 'bhim';
    }
    
    return 'other';
  };
  
  const txProvider = getProviderLogo();
  
  // Get icon color based on provider
  const getIconBg = () => {
    switch(txProvider) {
      case 'gpay':
        return 'bg-blue-100 dark:bg-blue-900/30';
      case 'phonepe':
        return 'bg-purple-100 dark:bg-purple-900/30';
      case 'paytm':
        return 'bg-blue-100 dark:bg-blue-900/30';
      case 'bhim':
        return 'bg-orange-100 dark:bg-orange-900/30';
      default:
        return isIncoming 
          ? 'bg-green-100 dark:bg-green-900/30' 
          : 'bg-red-100 dark:bg-red-900/30';
    }
  };
  
  // Get provider icon
  const ProviderIcon = () => {
    switch(txProvider) {
      case 'gpay':
        return <div className="text-blue-600 dark:text-blue-400 text-[10px] font-bold">GPay</div>;
      case 'phonepe':
        return <div className="text-purple-600 dark:text-purple-400 text-[10px] font-bold">PhonePe</div>;
      case 'paytm':
        return <div className="text-blue-600 dark:text-blue-400 text-[10px] font-bold">Paytm</div>;
      case 'bhim':
        return <div className="text-orange-600 dark:text-orange-400 text-[10px] font-bold">BHIM</div>;
      default:
        return <Smartphone className="h-3 w-3 text-muted-foreground" />;
    }
  };

  return (
    <Card className="card-hover bg-gradient-to-r from-white to-gray-50 border-gray-200/80 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700 mb-3">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center space-x-3">
          <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${getIconBg()}`}>
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
              <p className={`font-medium whitespace-nowrap ${amountColor} ${amountColorDark}`}>
                {isIncoming ? '+ ' : '- '}₹{amount.toLocaleString()}
              </p>
            </div>
            
            <div className="mt-1 text-xs sm:text-sm flex items-center">
              <div className="mr-1 h-4 w-4 rounded-full bg-muted flex items-center justify-center dark:bg-muted/50">
                <ProviderIcon />
              </div>
              
              <div className="flex-1 flex items-center text-muted-foreground overflow-hidden">
                <span className="font-medium text-foreground truncate max-w-[80px] dark:text-gray-200">{displaySenderName}</span>
                {displaySenderUpiId && (
                  <span className="ml-1 truncate dark:text-gray-400 text-xs hidden sm:inline">({displaySenderUpiId})</span>
                )}
                <ArrowRight className="h-3.5 w-3.5 mx-1 shrink-0 dark:text-gray-400" />
                <span className="font-medium text-foreground truncate max-w-[80px] dark:text-gray-200">{displayReceiverName}</span>
                {displayReceiverUpiId && (
                  <span className="ml-1 truncate dark:text-gray-400 text-xs hidden sm:inline">({displayReceiverUpiId})</span>
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
