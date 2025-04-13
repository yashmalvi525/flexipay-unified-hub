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
  return <Card className={`card-hover cursor-pointer overflow-hidden dark:bg-gray-800 ${isDefault ? 'upi-card-default' : ''}`} onClick={onClick}>
      <CardContent className="p-4 flex items-center space-x-4 bg-gray-800">
        <div className="h-10 w-10 rounded-full bg-flexipay-light-purple dark:bg-flexipay-purple/30 flex items-center justify-center shrink-0">
          <CreditCard className="h-5 w-5 text-flexipay-purple dark:text-flexipay-light-purple" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold truncate dark:text-white">{id}</h3>
            {isDefault && <Badge className="bg-flexipay-purple dark:bg-flexipay-purple text-white">Default</Badge>}
          </div>
          <p className="text-sm text-foreground dark:text-gray-200">{name}</p>
          <p className="text-xs text-muted-foreground dark:text-gray-400">{bank}</p>
          {lastUsed && <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">Last used: {lastUsed}</p>}
        </div>
      </CardContent>
    </Card>;
};