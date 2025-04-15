
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UpiCard } from '@/components/upi/UpiCard';
import { TransactionHistory } from '@/components/transactions/TransactionHistory';
import { EnhancedBalanceOverview } from '@/components/analytics/EnhancedBalanceOverview';
import { FeatureGrid } from '@/components/dashboard/FeatureGrid';
import { mockUpiIds, mockTransactions, mockBalanceData, mockCurrentBalance } from '@/utils/mock-data';
import { CreditCard, TrendingUp, Gift, Plus, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">Welcome to <span className="text-[#7E69AB]">Flexi</span><span className="text-[#33C3F0]">Pay</span></h1>
      </div>
      
      {/* Balance Overview Card */}
      <div className="rounded-3xl overflow-hidden">
        <EnhancedBalanceOverview balanceData={mockBalanceData} currentBalance={mockCurrentBalance} />
      </div>
      
      {/* Feature Grid */}
      <FeatureGrid />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1 md:col-span-2 card-hover bg-gradient-to-br from-white to-flexipay-light-purple/30 border-flexipay-purple/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-flexipay-purple" />
                <span>My UPI IDs</span>
              </div>
              <Button size="sm" variant="outline" className="border-flexipay-purple/30 hover:bg-flexipay-purple/10" asChild>
                <Link to="/upi">
                  <Plus className="h-4 w-4 mr-1" />
                  <span>Add</span>
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {mockUpiIds.slice(0, 2).map(upi => <UpiCard key={upi.id} id={upi.id} name={upi.name} bank={upi.bank} isDefault={upi.isDefault} lastUsed={upi.lastUsed} />)}
            </div>
            <Button variant="ghost" size="sm" className="w-full text-flexipay-purple hover:text-flexipay-purple/80 hover:bg-flexipay-purple/10" asChild>
              <Link to="/upi">View all UPI IDs</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 card-hover bg-gradient-to-br from-flexipay-blue/5 to-flexipay-purple/5 border-flexipay-purple/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Zap className="h-5 w-5 mr-2 text-flexipay-blue" />
              Quick Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Spending Trend</p>
                <p className="font-medium">12% less than last week</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Gift className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rewards Available</p>
                <p className="font-medium">200 points to redeem</p>
              </div>
            </div>
            
            <Button className="w-full bg-gradient-to-r from-flexipay-blue to-flexipay-purple text-white hover:opacity-90" asChild>
              <Link to="/analytics">
                <span>Full Analytics</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card className="card-hover">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Recent Transactions</span>
            <Button variant="ghost" size="sm" className="text-flexipay-purple hover:text-flexipay-purple/80 hover:bg-flexipay-purple/10" asChild>
              <Link to="/history">View All</Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <TransactionHistory transactions={mockTransactions} compactView={true} />
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
