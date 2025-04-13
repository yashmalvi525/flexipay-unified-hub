
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TransactionHistory } from '@/components/transactions/TransactionHistory';
import { mockTransactions } from '@/utils/mock-data';
import { Card, CardContent } from "@/components/ui/card";
import { Tag, History, Filter, CalendarRange } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const HistoryPage = () => {
  const isMobile = useIsMobile();
  
  return (
    <AppLayout>
      <div className="mx-auto space-y-4 sm:space-y-6 animate-fade-in" 
           style={{ width: '100%', maxWidth: "640px", touchAction: 'pan-y' }}>
        <div className="flex items-center justify-between px-4 sm:px-0">
          <h1 className="text-xl sm:text-2xl font-bold flex items-center">
            <History className="h-6 w-6 mr-2 text-flexipay-purple dark:text-flexipay-light-purple" />
            <span className="text-gradient-primary dark:text-white">
              Transaction History
            </span>
          </h1>
          
          <div className="flex items-center space-x-1 bg-gradient-to-r from-flexipay-purple to-flexipay-blue text-white rounded-full px-3 py-1.5 shadow-sm">
            <CalendarRange className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            <span className="text-xs font-medium">All Transactions</span>
          </div>
        </div>
        
        <Card className="card-hover bg-gradient-to-r from-white to-flexipay-light-purple/5 border-flexipay-purple/20 overflow-hidden relative dark:from-gray-900 dark:to-flexipay-purple/10 dark:border-flexipay-purple/30 mx-2 sm:mx-0 shadow-md">
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-flexipay-blue/5 rounded-full blur-xl dark:bg-flexipay-blue/10"></div>
          <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-flexipay-purple/5 rounded-full blur-xl dark:bg-flexipay-purple/10"></div>
          
          <CardContent className={`relative ${isMobile ? 'p-2 sm:p-3' : 'p-4 md:p-6'}`}>
            <div className="overflow-x-hidden">
              <TransactionHistory transactions={mockTransactions} showFullDetails={true} />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default HistoryPage;
