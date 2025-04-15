
import React from 'react';
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface BalanceDataPoint {
  date: string;
  amount: number;
}

interface EnhancedBalanceOverviewProps {
  balanceData: BalanceDataPoint[];
  currentBalance: number;
}

export const EnhancedBalanceOverview: React.FC<EnhancedBalanceOverviewProps> = ({
  balanceData,
  currentBalance
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(amount).replace('₹', '₹');
  };

  return (
    <Card className="w-full bg-[#F8F7FF] rounded-3xl border-none p-6">
      <div className="flex flex-col space-y-1 mb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-medium text-gray-800">Balance Overview</h3>
          <p className="text-2xl font-medium text-gray-800">
            {formatCurrency(currentBalance)}
          </p>
        </div>
      </div>

      <div className="h-[200px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={balanceData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: '#666' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#666' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value}`}
            />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#7E69AB"
              strokeWidth={2}
              dot={{ r: 4, fill: '#7E69AB', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#7E69AB', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
