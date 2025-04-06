
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UpiCard } from './UpiCard';

export interface UpiId {
  id: string;
  name: string;
  bank: string;
  isDefault?: boolean;
  lastUsed?: string;
}

interface UpiSelectorProps {
  upiIds: UpiId[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  variant?: 'dropdown' | 'cards';
}

export const UpiSelector: React.FC<UpiSelectorProps> = ({ 
  upiIds, 
  selectedId, 
  onSelect,
  variant = 'dropdown'
}) => {
  const [selected, setSelected] = useState(selectedId || (upiIds[0]?.id ?? ''));
  
  const handleSelect = (value: string) => {
    setSelected(value);
    if (onSelect) {
      onSelect(value);
    }
  };

  if (variant === 'dropdown') {
    return (
      <div className="w-full">
        <Select value={selected} onValueChange={handleSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select UPI ID" />
          </SelectTrigger>
          <SelectContent>
            {upiIds.map(upi => (
              <SelectItem key={upi.id} value={upi.id}>
                <div className="flex items-center">
                  <span>{upi.id}</span>
                  <span className="ml-2 text-sm text-muted-foreground">({upi.bank})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {upiIds.map(upi => (
        <UpiCard 
          key={upi.id}
          id={upi.id}
          name={upi.name}
          bank={upi.bank}
          isDefault={upi.isDefault}
          lastUsed={upi.lastUsed}
          onClick={() => handleSelect(upi.id)}
        />
      ))}
    </div>
  );
};
