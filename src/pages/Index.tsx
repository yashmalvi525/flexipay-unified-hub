
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight, TrendingUp } from 'lucide-react';
import { SpendingByUpi } from '@/components/analytics/SpendingByUpi';
import { EnhancedBalanceOverview } from '@/components/analytics/EnhancedBalanceOverview';
import { FeatureGrid } from '@/components/dashboard/FeatureGrid';
import { mockBalanceData, mockCurrentBalance, mockSpendingByUpi } from '@/utils/mock-data';

const Dashboard = () => {
  return (
    <div className="space-y-4 animate-fade-in p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">Welcome to <span className="text-[#7E69AB]">Flexi</span><span className="text-[#33C3F0]">Pay</span></h1>
      </div>
      
      {/* Balance Overview */}
      <div className="rounded-3xl overflow-hidden mb-4">
        <EnhancedBalanceOverview balanceData={mockBalanceData} currentBalance={mockCurrentBalance} />
      </div>
      
      {/* Money Cards */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        <Card className="bg-[#F1FFF5] border-none p-4">
          <div className="flex items-start">
            <div className="bg-[#E1FFE9] rounded-full p-2 mr-3">
              <ArrowDownLeft className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-medium text-gray-800">Money Received</h3>
              <p className="text-3xl font-semibold text-green-500 mt-1">₹7,500</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-600">Last 30 days</span>
                <div className="flex items-center bg-[#E1FFE9] rounded-full px-2 py-1">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">8% growth</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-[#FFF5F5] border-none p-4">
          <div className="flex items-start">
            <div className="bg-[#FFE9E9] rounded-full p-2 mr-3">
              <ArrowUpRight className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-medium text-gray-800">Money Spent</h3>
              <p className="text-3xl font-semibold text-red-500 mt-1">₹2,618</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-600">Last 30 days</span>
                <div className="flex items-center bg-[#FFE9E9] rounded-full px-2 py-1">
                  <span className="text-xs text-red-600">Reduce spending</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Spending by UPI */}
      <Card className="bg-[#F8F7FF] border-none p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 rounded-full bg-[#E5DEFF] flex items-center justify-center">
            <div className="w-3 h-3 rounded-full border-2 border-[#7E69AB]" />
          </div>
          <h3 className="text-lg font-medium text-gray-800">Activity by UPI ID</h3>
        </div>
        <SpendingByUpi upiSpending={mockSpendingByUpi} />
      </Card>

      {/* Feature Grid */}
      <FeatureGrid />
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
