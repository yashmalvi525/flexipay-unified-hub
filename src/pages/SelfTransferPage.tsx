
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UpiSelector, UpiId } from '@/components/upi/UpiSelector';
import { mockUpiIds } from '@/utils/mock-data';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SelfTransferPage = () => {
  const [amount, setAmount] = useState('');
  const [selectedFromUpi, setSelectedFromUpi] = useState(mockUpiIds[0]?.id || '');
  const [selectedToUpi, setSelectedToUpi] = useState(mockUpiIds.length > 1 ? mockUpiIds[1].id : '');
  const { toast } = useToast();
  
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !selectedFromUpi || !selectedToUpi) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedFromUpi === selectedToUpi) {
      toast({
        title: "Same UPI ID",
        description: "Cannot transfer to the same UPI ID",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Transfer initiated",
      description: `₹${amount} transferred from ${selectedFromUpi} to ${selectedToUpi}`,
    });
  };

  // Filter out the selected "from" UPI ID from the "to" options
  const toUpiOptions = mockUpiIds.filter(upi => upi.id !== selectedFromUpi);

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in pb-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 text-gradient-primary">Self Transfer</h1>
          <p className="text-muted-foreground">Transfer between your own UPI IDs</p>
        </div>
        
        <Card className="border-2 border-flexipay-purple/30 dark:border-flexipay-purple/20">
          <form onSubmit={handlePayment}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <RefreshCw className="h-5 w-5 mr-2 text-flexipay-purple" />
                Self Transfer
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>From UPI ID</Label>
                <UpiSelector 
                  upiIds={mockUpiIds} 
                  selectedId={selectedFromUpi} 
                  onSelect={setSelectedFromUpi} 
                />
              </div>
              
              <div className="space-y-2">
                <Label>To UPI ID</Label>
                <Select value={selectedToUpi} onValueChange={setSelectedToUpi}>
                  <SelectTrigger className="w-full dark:bg-gray-800 dark:border-gray-700">
                    <SelectValue placeholder="Select destination UPI ID" />
                  </SelectTrigger>
                  <SelectContent>
                    {toUpiOptions.map((upi: UpiId) => (
                      <SelectItem key={upi.id} value={upi.id}>
                        <div className="flex flex-col">
                          <span>{upi.id}</span>
                          <span className="text-xs text-muted-foreground">{upi.bank}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {toUpiOptions.length === 0 && (
                  <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                    You need another UPI ID to make a self-transfer
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input 
                  id="amount" 
                  placeholder="Enter amount" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  min="1"
                  step="1"
                  className="dark:bg-gray-800 dark:border-gray-700"
                  required
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-flexipay-purple to-flexipay-blue text-white hover:opacity-90 dark:from-flexipay-purple/80 dark:to-flexipay-blue/80"
                disabled={toUpiOptions.length === 0}
              >
                Transfer Now
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SelfTransferPage;
