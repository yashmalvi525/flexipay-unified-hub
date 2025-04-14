
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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
    }).format(amount);
  };

  return (
    <Card className="w-full bg-gradient-to-br from-[#E5DEFF] to-[#F1F0FB] border-[#9b87f5]/20">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col space-y-1 mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-[#6E59A5]">Balance Overview</h3>
          <p className="text-2xl sm:text-3xl font-bold text-[#9b87f5]">
            {formatCurrency(currentBalance)}
          </p>
        </div>

        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={balanceData}>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#6E59A5' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6E59A5' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip 
                formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Balance']}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  background: '#E5DEFF',
                  border: '1px solid #9b87f5',
                  borderRadius: '8px',
                  color: '#6E59A5'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#9b87f5" 
                strokeWidth={2}
                dot={{ r: 4, fill: '#9b87f5' }}
                activeDot={{ r: 6, fill: '#6E59A5' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
