
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TransactionHistory } from '@/components/transactions/TransactionHistory';
import { mockTransactions } from '@/utils/mock-data';

const HistoryPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold">Transaction History</h1>
        <TransactionHistory transactions={mockTransactions} />
      </div>
    </AppLayout>
  );
};

export default HistoryPage;
