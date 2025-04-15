
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
  return (
    <Card className="w-full bg-[#F8F7FF] rounded-3xl border-none p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium text-gray-800">Balance Overview</h3>
        <p className="text-2xl font-medium text-gray-800">₹{currentBalance.toLocaleString()}</p>
      </div>

      <div className="h-[180px]">
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
