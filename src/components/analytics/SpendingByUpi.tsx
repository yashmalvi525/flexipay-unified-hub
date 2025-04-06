
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Activity by UPI ID</CardTitle>
      </CardHeader>
      <CardContent>
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
              <Tooltip 
                formatter={(value) => [`₹${Number(value).toLocaleString()}`]}
              />
              <Bar dataKey="spent" fill="#F87171" name="Sent" />
              <Bar dataKey="received" fill="#4ADE80" name="Received" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
