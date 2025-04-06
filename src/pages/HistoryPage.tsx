
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TransactionHistory } from '@/components/transactions/TransactionHistory';
import { mockTransactions } from '@/utils/mock-data';
import { Card, CardContent } from "@/components/ui/card";

const HistoryPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-flexipay-purple to-flexipay-blue bg-clip-text text-transparent">
              Transaction History
            </span>
          </h1>
        </div>
        
        <Card className="border-flexipay-purple/20 overflow-hidden relative">
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-flexipay-blue/5 rounded-full blur-xl"></div>
          <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-flexipay-purple/5 rounded-full blur-xl"></div>
          
          <CardContent className="p-4 relative">
            <TransactionHistory transactions={mockTransactions} />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default HistoryPage;
