
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UpiCard } from '@/components/upi/UpiCard';
import { TransactionCard } from '@/components/transactions/TransactionCard';
import { BalanceOverview } from '@/components/analytics/BalanceOverview';
import { mockUpiIds, mockTransactions, mockBalanceData, mockCurrentBalance } from '@/utils/mock-data';
import { CreditCard, QrCode, ArrowUpRight, ArrowDownLeft, Plus } from 'lucide-react';

const Dashboard = () => {
  // Get the latest 3 transactions for the dashboard
  const recentTransactions = mockTransactions.slice(0, 3);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Welcome to FlexiPay</h1>
      </div>
      
      <BalanceOverview balanceData={mockBalanceData} currentBalance={mockCurrentBalance} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1 card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <QrCode className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="btn-primary w-full" asChild>
              <a href="/scan">
                <QrCode className="h-4 w-4 mr-2" />
                <span>Scan QR</span>
              </a>
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" asChild>
                <a href="/upi">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  <span>Pay</span>
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/upi">
                  <ArrowDownLeft className="h-4 w-4 mr-2" />
                  <span>Request</span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 md:col-span-2 card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                <span>My UPI IDs</span>
              </div>
              <Button size="sm" variant="outline" asChild>
                <a href="/upi">
                  <Plus className="h-4 w-4 mr-1" />
                  <span>Add</span>
                </a>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {mockUpiIds.slice(0, 2).map((upi) => (
                <UpiCard 
                  key={upi.id}
                  id={upi.id}
                  name={upi.name}
                  bank={upi.bank}
                  isDefault={upi.isDefault}
                  lastUsed={upi.lastUsed}
                />
              ))}
            </div>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <a href="/upi">View all UPI IDs</a>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Recent Transactions</span>
            <Button variant="ghost" size="sm" asChild>
              <a href="/history">View All</a>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentTransactions.map(transaction => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const Index = () => {
  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  );
};

export default Index;
