
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UpiSelector } from '@/components/upi/UpiSelector';
import { mockUpiIds } from '@/utils/mock-data';
import { PhoneCall } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PayPhonePage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedUpi, setSelectedUpi] = useState(mockUpiIds[0]?.id || '');
  const { toast } = useToast();
  
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || !amount || !selectedUpi) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Payment initiated",
      description: `₹${amount} sent to ${phoneNumber} from ${selectedUpi}`,
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in pb-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 text-gradient-primary">Pay to Phone Number</h1>
          <p className="text-muted-foreground">Send money directly to a phone number</p>
        </div>
        
        <Card className="border-2 border-flexipay-purple/30 dark:border-flexipay-purple/20">
          <form onSubmit={handlePayment}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PhoneCall className="h-5 w-5 mr-2 text-flexipay-purple" />
                Pay to Phone Number
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  placeholder="Enter 10-digit phone number" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  type="tel"
                  pattern="[0-9]{10}"
                  maxLength={10}
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

export default PayPhonePage;
