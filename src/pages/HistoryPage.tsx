
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TransactionHistory } from '@/components/transactions/TransactionHistory';
import { mockTransactions } from '@/utils/mock-data';
import { Card, CardContent } from "@/components/ui/card";
import { Tag } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const HistoryPage = () => {
  const isMobile = useIsMobile();
  
  return (
    <AppLayout>
      <div className="space-y-4 sm:space-y-6 animate-fade-in mx-auto" 
           style={{ maxWidth: '95%', touchAction: 'pan-y' }}>
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold">
            <span className="text-gradient-primary">
              Transaction History
            </span>
          </h1>
          
          <div className="flex items-center space-x-1 bg-muted rounded-full px-2 py-1">
            <Tag className="h-3 w-3 sm:h-4 sm:w-4 text-flexipay-purple" />
            <span className="text-xs font-medium">Detailed Logs</span>
          </div>
        </div>
        
        <Card className="card-hover bg-gradient-to-r from-white to-flexipay-light-purple/10 border-flexipay-purple/20 overflow-hidden relative">
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-flexipay-blue/5 rounded-full blur-xl"></div>
          <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-flexipay-purple/5 rounded-full blur-xl"></div>
          
          <CardContent className={`${isMobile ? 'p-2' : 'p-3 sm:p-4 md:p-6'} relative`}>
            <div className="overflow-x-auto">
              <TransactionHistory transactions={mockTransactions} showFullDetails={!isMobile} />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default HistoryPage;
