
import React, { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  // Format currency to INR
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Custom tooltip component for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-flexipay-dark-card p-2 rounded-md border border-flexipay-neon-purple/30 shadow-lg">
          <p className="text-sm font-medium text-white">{`${label}`}</p>
          <p className="text-sm font-bold text-flexipay-neon-purple">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full overflow-hidden bg-flexipay-dark-card text-white border-0 relative rounded-xl">
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-xl p-[1px] bg-gradient-to-br from-flexipay-neon-purple/80 via-flexipay-glow-purple/50 to-flexipay-blue/30 blur-[0.5px]"></div>
      
      {/* Glow effects */}
      <div className="absolute -left-20 top-10 w-40 h-40 bg-flexipay-neon-purple/20 rounded-full blur-3xl"></div>
      <div className="absolute -right-20 bottom-10 w-40 h-40 bg-flexipay-glow-purple/20 rounded-full blur-3xl"></div>
      
      <CardContent className="relative z-10 p-4 sm:p-6">
        <div className="flex flex-col space-y-1">
          <h3 className="text-lg sm:text-xl font-bold text-white/90">Balance Overview</h3>
          <p className="text-2xl sm:text-3xl font-bold text-white">
            {formatCurrency(currentBalance)}
          </p>
        </div>

        <div className="h-[180px] mt-4 animate-slide-up-fade">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={balanceData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c4a5ff" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#9370DB" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                stroke="#444" 
                tick={{ fill: '#999', fontSize: 12 }} 
              />
              <YAxis 
                stroke="#444" 
                tick={{ fill: '#999', fontSize: 12 }} 
                tickFormatter={(value) => `₹${value}`} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#c4a5ff"
                strokeWidth={2}
                dot={(props) => {
                  const { cx, cy } = props;
                  return (
                    <g>
                      <circle 
                        cx={cx} 
                        cy={cy} 
                        r={4} 
                        fill="#c4a5ff" 
                        className="animate-pulse-glow"
                      />
                    </g>
                  );
                }}
                activeDot={{ r: 6, fill: 'white', stroke: '#c4a5ff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
