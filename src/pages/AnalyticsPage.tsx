
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BalanceOverview } from '@/components/analytics/BalanceOverview';
import { SpendingByUpi } from '@/components/analytics/SpendingByUpi';
import { mockBalanceData, mockCurrentBalance, mockSpendingByUpi, mockTransactions } from '@/utils/mock-data';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const AnalyticsPage = () => {
  // Calculate total incoming/outgoing
  const totalIncoming = mockTransactions
    .filter(t => t.type === 'incoming')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalOutgoing = mockTransactions
    .filter(t => t.type === 'outgoing')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold">Financial Analytics</h1>

        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <BalanceOverview balanceData={mockBalanceData} currentBalance={mockCurrentBalance} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <ArrowDownLeft className="h-5 w-5 mr-2 text-green-500" />
                    Money Received
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-500">₹{totalIncoming.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <ArrowUpRight className="h-5 w-5 mr-2 text-red-500" />
                    Money Spent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-500">₹{totalOutgoing.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>
            </div>
            
            <SpendingByUpi upiSpending={mockSpendingByUpi} />
          </TabsContent>
          
          <TabsContent value="monthly">
            <div className="text-center py-8 text-muted-foreground">
              <p>Monthly analytics will be available in the next version</p>
            </div>
          </TabsContent>
          
          <TabsContent value="yearly">
            <div className="text-center py-8 text-muted-foreground">
              <p>Yearly analytics will be available in the next version</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AnalyticsPage;
