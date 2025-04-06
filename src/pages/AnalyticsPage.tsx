import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BalanceOverview } from '@/components/analytics/BalanceOverview';
import { SpendingByUpi } from '@/components/analytics/SpendingByUpi';
import { mockBalanceData, mockCurrentBalance, mockSpendingByUpi, mockTransactions } from '@/utils/mock-data';
import { ArrowUpRight, ArrowDownLeft, TrendingUp, TrendingDown, Layers, Calendar, Tag, PieChart } from 'lucide-react';

const AnalyticsPage = () => {
  // Calculate total incoming/outgoing
  const totalIncoming = mockTransactions
    .filter(t => t.type === 'incoming')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalOutgoing = mockTransactions
    .filter(t => t.type === 'outgoing')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate percentages for visual indicators
  const percentageSaved = Math.round((totalIncoming - totalOutgoing) / totalIncoming * 100);
  const isPositiveBalance = percentageSaved > 0;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Your <span className="text-gradient-primary">Financial Insights</span></h1>
          <div className="flex items-center space-x-1 bg-muted rounded-full px-3 py-1">
            <Tag className="h-4 w-4 text-flexipay-purple" />
            <span className="text-xs font-medium">Smart Analysis</span>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4 bg-gradient-to-r from-flexipay-purple/10 to-flexipay-blue/10 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white">Overview</TabsTrigger>
            <TabsTrigger value="monthly" className="data-[state=active]:bg-white">Monthly</TabsTrigger>
            <TabsTrigger value="yearly" className="data-[state=active]:bg-white">Yearly</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-gradient-to-r from-flexipay-light-purple to-white border-flexipay-purple/20 overflow-hidden relative">
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-flexipay-purple/10 rounded-full blur-xl"></div>
              <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-flexipay-blue/10 rounded-full blur-xl"></div>
              <CardContent className="p-6 relative">
                <BalanceOverview balanceData={mockBalanceData} currentBalance={mockCurrentBalance} />
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="card-hover bg-gradient-to-br from-white to-green-50 border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <ArrowDownLeft className="h-5 w-5 mr-2 text-green-500" />
                    Money Received
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-500">₹{totalIncoming.toLocaleString()}</div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-muted-foreground">Last 30 days</p>
                    <div className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>8% growth</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-hover bg-gradient-to-br from-white to-red-50 border-red-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <ArrowUpRight className="h-5 w-5 mr-2 text-red-500" />
                    Money Spent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-500">₹{totalOutgoing.toLocaleString()}</div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-muted-foreground">Last 30 days</p>
                    <div className="flex items-center text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      <span>Reduce spending</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="card-hover bg-gradient-to-r from-flexipay-light-purple/50 to-white border-flexipay-purple/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-flexipay-purple" />
                  Spending by UPI ID
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SpendingByUpi upiSpending={mockSpendingByUpi} />
              </CardContent>
            </Card>

            <Card className="card-hover bg-gradient-to-br from-white to-blue-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Layers className="h-5 w-5 mr-2 text-blue-500" />
                  Savings Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-blue-500">
                      {isPositiveBalance ? '+' : ''}{percentageSaved}%
                    </div>
                    <p className="text-sm text-muted-foreground">Savings rate</p>
                  </div>
                  <div className={`h-24 w-24 rounded-full flex items-center justify-center ${
                    isPositiveBalance ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {isPositiveBalance ? (
                      <TrendingUp className="h-12 w-12 text-green-500" />
                    ) : (
                      <TrendingDown className="h-12 w-12 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="mt-4 text-sm">
                  <p className="text-muted-foreground">
                    {isPositiveBalance 
                      ? "You're saving money! Keep it up." 
                      : "Spending more than you earn. Consider reducing expenses."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="monthly">
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 bg-muted rounded-lg">
              <Calendar className="h-12 w-12 text-flexipay-blue opacity-50" />
              <div>
                <h3 className="text-xl font-bold">Monthly analytics coming soon</h3>
                <p className="text-muted-foreground mt-1">Check back for detailed monthly breakdown</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="yearly">
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 bg-muted rounded-lg">
              <Calendar className="h-12 w-12 text-flexipay-purple opacity-50" />
              <div>
                <h3 className="text-xl font-bold">Yearly analytics coming soon</h3>
                <p className="text-muted-foreground mt-1">Check back for detailed yearly breakdown</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AnalyticsPage;
