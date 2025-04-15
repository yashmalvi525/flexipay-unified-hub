
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from 'lucide-react';

interface UpiCardProps {
  id: string;
  name: string;
  bank: string;
  isDefault?: boolean;
  lastUsed?: string;
  onClick?: () => void;
}

export const UpiCard: React.FC<UpiCardProps> = ({ 
  id, 
  name, 
  bank,
  isDefault = false,
  lastUsed,
  onClick
}) => {
  return (
    <Card 
      className="card-hover cursor-pointer overflow-hidden" 
      onClick={onClick}
    >
      <CardContent className="p-4 flex items-center space-x-4">
        <div className="h-10 w-10 rounded-full bg-flexipay-light-purple flex items-center justify-center">
          <CreditCard className="h-5 w-5 text-flexipay-purple" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{id}</h3>
            {isDefault && <Badge className="bg-flexipay-purple">Default</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">{bank}</p>
          {lastUsed && (
            <p className="text-xs text-muted-foreground mt-1">Last used: {lastUsed}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
