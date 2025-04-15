
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface UpiSpending {
  upiId: string;
  spent: number;
  received: number;
}

interface SpendingByUpiProps {
  upiSpending: UpiSpending[];
}

export const SpendingByUpi: React.FC<SpendingByUpiProps> = ({ upiSpending }) => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={upiSpending}>
          <XAxis 
            dataKey="upiId" 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₹${value}`}
          />
          <Bar dataKey="spent" fill="#F87171" name="Sent" />
          <Bar dataKey="received" fill="#4ADE80" name="Received" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
