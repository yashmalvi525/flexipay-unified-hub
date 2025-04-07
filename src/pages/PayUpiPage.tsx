
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UpiSelector } from '@/components/upi/UpiSelector';
import { mockUpiIds } from '@/utils/mock-data';
import { AtSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PayUpiPage = () => {
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedUpi, setSelectedUpi] = useState(mockUpiIds[0]?.id || '');
  const { toast } = useToast();
  
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!upiId || !amount || !selectedUpi) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Payment initiated",
      description: `₹${amount} sent to ${upiId} from ${selectedUpi}`,
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in pb-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 text-gradient-primary">Pay to UPI ID</h1>
          <p className="text-muted-foreground">Transfer money directly using UPI ID</p>
        </div>
        
        <Card className="border-2 border-flexipay-purple/30 dark:border-flexipay-purple/20">
          <form onSubmit={handlePayment}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AtSign className="h-5 w-5 mr-2 text-flexipay-purple" />
                Pay to UPI ID
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="upi-id">UPI ID</Label>
                <Input 
                  id="upi-id" 
                  placeholder="Enter UPI ID (e.g., name@bank)" 
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="dark:bg-gray-800 dark:border-gray-700"
                  required
                />
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
              
              <div className="space-y-2">
                <Label htmlFor="note">Note (Optional)</Label>
                <Input 
                  id="note" 
                  placeholder="Add a note" 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Select UPI ID to pay from</Label>
                <UpiSelector 
                  upiIds={mockUpiIds} 
                  selectedId={selectedUpi} 
                  onSelect={setSelectedUpi} 
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-flexipay-purple to-flexipay-blue text-white hover:opacity-90 dark:from-flexipay-purple/80 dark:to-flexipay-blue/80"
              >
                Pay Now
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PayUpiPage;
